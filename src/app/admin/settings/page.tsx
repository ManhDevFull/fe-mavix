"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import { useAdmin } from "../../../components/admin-context";
import styles from "./settings.module.css";

type Settings = {
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  plan: string;
  planExpiresAt: string | null;
  qrBankName: string | null;
  qrBankAccountName: string | null;
  qrBankAccountNumber: string | null;
  qrPaymentPrefix: string | null;
  publicMenuUrl: string;
};

type HistoryEntry = {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  price: string;
  status: "completed" | "pending";
  type: string;
};

type UpgradeCalc = {
  currentPlan: string;
  targetPlan: string;
  remainingMonths: number;
  remainingValue: number;
  totalNewCost: number;
  amountToPay: number;
  isUpgrade: boolean;
  startsAt: string;
  expiresAt: string;
};

type TabKey = "general" | "brand" | "staff" | "payment" | "security" | "subscription";

export default function SettingsPage() {
  const { setTitle, setDescription, plan: currentPlan, setPlan } = useAdmin();
  const toast = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  // Subscription States
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [duration, setDuration] = useState(1);
  const [calc, setCalc] = useState<UpgradeCalc | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "generating" | "pending" | "success">("idle");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Password Change States
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: ""
  });

  async function handleRequestPasswordChange() {
    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      return toast.error("Vui lòng nhập đầy đủ thông tin");
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return toast.error("Mật khẩu mới không khớp");
    }
    if (pwdForm.newPassword.length < 6) {
      return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    try {
      await apiFetch("/admin/change-password/request", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: pwdForm.currentPassword,
          newPassword: pwdForm.newPassword
        })
      });
      toast.success("Mã OTP đã được gửi", "Vui lòng kiểm tra email của bạn.");
      setIsVerifyingPassword(true);
    } catch (error) {
      toast.error("Lỗi gửi mã OTP", error instanceof Error ? error.message : undefined);
    }
  }

  async function handleVerifyPasswordChange() {
    if (!pwdForm.otp) return toast.error("Vui lòng nhập mã OTP");

    try {
      await apiFetch("/admin/change-password/verify", {
        method: "POST",
        body: JSON.stringify({
          otp: pwdForm.otp,
          currentPassword: pwdForm.currentPassword,
          newPassword: pwdForm.newPassword
        })
      });
      toast.success("Đổi mật khẩu thành công", "Vui lòng đăng nhập lại để tiếp tục.");
      // Optional: Log out user
      setTimeout(() => {
        const logoutBtn = document.querySelector('button[class*="logout"]') as HTMLButtonElement;
        if (logoutBtn) logoutBtn.click();
      }, 2000);
    } catch (error) {
      toast.error("Lỗi xác thực", error instanceof Error ? error.message : undefined);
    }
  }

  async function load() {
    const data = await apiFetch<Settings>("/admin/settings");
    setSettings(data);
    if (data.plan) setPlan(data.plan as any);
  }

  async function loadHistory() {
    try {
      const data = await apiFetch<HistoryEntry[]>("/admin/subscriptions/history");
      setHistory(data);
    } catch (err) { console.error(err); }
  }

  useEffect(() => {
    setTitle("CÀI ĐẶT HỆ THỐNG");
    setDescription("Cấu hình hồ sơ nhà hàng, QR thanh toán và thương hiệu");
    load().catch(e => toast.error("Lỗi tải cài đặt"));
    loadHistory();
  }, [setTitle, setDescription]);

  // Effect to calculate upgrade
  useEffect(() => {
    if (isRegistering && selectedPlan) {
      apiFetch<UpgradeCalc>(`/admin/subscriptions/calculate?plan=${selectedPlan.name}&months=${duration}`)
        .then(setCalc)
        .catch(() => toast.error("Lỗi tính toán nâng cấp"));
    }
  }, [isRegistering, selectedPlan, duration]);

  async function saveWorkspace(event: FormEvent) {
    if (event) event.preventDefault();
    if (!settings) return;
    try {
      setSettings(await apiFetch<Settings>("/admin/settings", { method: "PATCH", body: JSON.stringify(settings) }));
      toast.success("Đã lưu cài đặt");
    } catch (error) { toast.error("Lỗi lưu cài đặt"); }
  }

  const handleStartRegistration = (plan: any) => {
    setSelectedPlan(plan);
    setDuration(1);
    setIsRegistering(true);
  };

  const handleConfirmRegister = async () => {
    if (!calc) return;
    setPaymentStatus("generating");
    setTimeout(async () => {
      setPaymentStatus("pending");
      setTimeout(async () => {
        try {
          const resp = await apiFetch<{ ok: boolean, plan: string }>("/admin/subscriptions/upgrade", {
            method: 'POST',
            body: JSON.stringify({
              planName: selectedPlan.name,
              durationMonths: duration
            })
          });
          if (resp.ok) {
            setPaymentStatus("success");
            setTimeout(() => {
              setPlan(resp.plan as any);
              load();
              loadHistory();
              setIsRegistering(false);
              setPaymentStatus("idle");
              toast.success("Nâng cấp thành công");
            }, 2000);
          }
        } catch (e) { setPaymentStatus("idle"); toast.error("Lỗi thanh toán"); }
      }, 3000);
    }, 1000);
  };

  if (!settings) return null;

  const plans = [
    { name: "Free", price: "0", label: "Dùng QR order cơ bản", features: ["Tối đa 5 bàn", "Gọi món bằng QR", "Đồng bộ đơn hàng"] },
    { name: "Plus", price: "499.000", label: "Quản lý QR IoT", features: ["Không giới hạn bàn", "Dashboard thiết bị", "Trạng thái Realtime"] },
    { name: "Pro", price: "999.000", label: "IoT Chuyên nghiệp", features: ["Heartbeat monitoring", "Dynamic QR", "Device Log"] },
    { name: "Premium", price: "1.999.000", label: "IoT Enterprise", features: ["Firmware OTA", "Remote Reboot", "Priority Support"] },
    { name: "Edition", price: "Custom", label: "Dành cho chuỗi", features: ["Server riêng", "SLA 99.99%", "API Integration"] }
  ];

  return (
    <>
      <section className={styles.tabs}>
        {[["general", "Chung"], ["brand", "Thương hiệu"], ["staff", "Nhân viên"], ["payment", "Thanh toán QR"], ["security", "Bảo mật"], ["subscription", "Gói quản lý"]].map(([key, label]) => (
          <button key={key} type="button" className={activeTab === key ? styles.active : ""} onClick={() => setActiveTab(key as any)}>{label}</button>
        ))}
      </section>

      <form className={`${styles.layout} ${activeTab === "subscription" ? styles.fullWidth : ""}`} onSubmit={saveWorkspace}>
        <div className={styles.mainCol}>
          {activeTab === "general" && (
            <article className={styles.panel}>
              <div className={styles.panelHead}><h3>Hồ sơ nhà hàng</h3><span>Chung</span></div>
              <div className={styles.row2}>
                <label className={styles.inputGroup}><span>Tên nhà hàng</span><input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} /></label>
                <label className={styles.inputGroup}><span>Số điện thoại</span><input value={settings.phone ?? ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} /></label>
              </div>
              <label className={styles.inputGroup}><span>Địa chỉ</span><textarea value={settings.address ?? ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></label>
            </article>
          )}

          {activeTab === "brand" && (
            <article className={styles.panel}>
              <div className={styles.panelHead}><h3>Thương hiệu hiển thị</h3><span>Thương hiệu</span></div>
              <div className={styles.row2}>
                <label className={styles.inputGroup}><span>Tên thương hiệu</span><input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} /></label>
                <label className={styles.inputGroup}><span>Slug quán</span><input value={settings.slug} disabled /></label>
              </div>
              <label className={styles.inputGroup}><span>Slogan</span><textarea value={settings.address ?? ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></label>
              <p className={styles.url}>Link menu công khai: {settings.publicMenuUrl}</p>
            </article>
          )}

          {activeTab === "subscription" && (
            <article className={styles.panel}>
              <div className={styles.panelHead}>
                <h3>Gói quản lý</h3>
                <div className={styles.badge} style={{ background: '#000', color: '#fff' }}>ĐANG DÙNG: {currentPlan.toUpperCase()}</div>
              </div>
              {!isRegistering ? (
                <>
                  <div className={styles.plansGrid}>{plans.map((p) => (
                    <div key={p.name} className={`${styles.planCard} ${currentPlan.toLowerCase() === p.name.toLowerCase() ? styles.activePlan : ""}`}>
                      <div><strong>{p.name}</strong><p>{p.label}</p></div>
                      <ul className={styles.featureList}>{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                      <div className={styles.price}><b>{p.price}{p.price !== "Custom" ? "đ" : ""}</b><span>{p.price !== "Custom" ? "/ tháng" : ""}</span></div>
                      <button type="button" className={styles.planBtn} disabled={currentPlan.toLowerCase() === p.name.toLowerCase()} onClick={() => { if (p.name === "Edition") { window.open("mailto:support@mavix.com"); return; } handleStartRegistration(p); }}>
                        {p.name === "Edition" ? "Liên hệ" : (currentPlan.toLowerCase() === p.name.toLowerCase() ? "Đang dùng" : "Nâng cấp")}
                      </button>
                    </div>
                  ))}</div>
                  <div className={styles.historySection}><h3>Lịch sử giao dịch</h3><table className={styles.historyTable}><thead><tr><th>Mã GD</th><th>Gói</th><th>Bắt đầu</th><th>Kết thúc</th><th>Giá trị</th><th>Loại</th></tr></thead><tbody>{history.map((h) => (<tr key={h.id}><td>{h.id}</td><td>{h.planName}</td><td>{h.startDate}</td><td>{h.endDate}</td><td>{h.price}</td><td>{h.type}</td></tr>))}</tbody></table></div>
                </>
              ) : (
                <div className={styles.registrationForm}>
                  <div className={styles.actionHeader}><button type="button" className={styles.backBtn} onClick={() => setIsRegistering(false)}>← Quay lại</button><h2>NÂNG CẤP LÊN {selectedPlan.name.toUpperCase()}</h2></div>
                  <div className={styles.row2}>
                    <label className={styles.inputGroup}><span>Thời hạn</span><select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} style={{ padding: '10px', border: '2px solid #000' }}><option value={1}>01 Tháng</option><option value={6}>06 Tháng - Giảm 10%</option><option value={12}>12 Tháng - Tặng 2 tháng</option></select></label>
                  </div>

                  {calc && (
                    <article className={styles.panel} style={{ background: '#f9f9f9', borderStyle: 'dashed', marginTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Gói hiện tại:</span><b>{calc.currentPlan.toUpperCase()}</b></div>
                      {calc.isUpgrade && calc.remainingValue > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}><span>Thời gian còn lại:</span><b>~ {calc.remainingMonths} tháng</b></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', color: '#1dbb87' }}><span>Giá trị khấu trừ:</span><b>- {calc.remainingValue.toLocaleString()}đ</b></div>
                        </>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                        <strong>Chi phí nâng cấp:</strong>
                        <strong style={{ fontSize: '1.2rem' }}>{calc.amountToPay.toLocaleString()}đ</strong>
                      </div>
                      <p style={{ fontSize: '0.75rem', marginTop: '10px', opacity: 0.7 }}>
                        Hiệu lực: {calc.startsAt} đến {calc.expiresAt}
                        {!calc.isUpgrade && " (Bắt đầu sau khi gói cũ hết hạn)"}
                      </p>
                    </article>
                  )}

                  <button type="button" className={styles.primary} style={{ height: '56px', marginTop: '20px' }} onClick={handleConfirmRegister} disabled={!calc}>
                    XÁC NHẬN & THANH TOÁN
                  </button>
                </div>
              )}
            </article>
          )}

          {activeTab === "security" && (
            <article className={styles.panel}>
              <div className={styles.panelHead}><h3>Thiết lập bảo mật</h3><span>Bảo mật</span></div>

              <div className={styles.securityWrapper}>
                <div className={styles.securityItem}>
                  <div className={styles.itemHead}>
                    <div>
                      <h4>Đổi mật khẩu</h4>
                      <p>Thay đổi mật khẩu đăng nhập để bảo vệ tài khoản của bạn.</p>
                    </div>
                    {!isVerifyingPassword && (
                      <button
                        type="button"
                        className={styles.ghost}
                        onClick={() => {
                          setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "", otp: "" });
                          setIsVerifyingPassword(false);
                        }}
                      >
                        Thiết lập
                      </button>
                    )}
                  </div>

                  <div className={styles.securityForm}>
                    {!isVerifyingPassword ? (
                      <div className={styles.pwdInputs}>
                        <div className={styles.inputGroup}>
                          <span>Mật khẩu hiện tại</span>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={pwdForm.currentPassword}
                            onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                          />
                        </div>
                        <div className={styles.row2}>
                          <div className={styles.inputGroup}>
                            <span>Mật khẩu mới</span>
                            <input
                              type="password"
                              placeholder="Tối thiểu 6 ký tự"
                              value={pwdForm.newPassword}
                              onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <span>Nhập lại mật khẩu mới</span>
                            <input
                              type="password"
                              placeholder="Xác nhận mật khẩu"
                              value={pwdForm.confirmPassword}
                              onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.primary}
                          style={{ marginTop: '20px' }}
                          onClick={handleRequestPasswordChange}
                        >
                          Xác nhận thay đổi (Nhận OTP)
                        </button>
                      </div>
                    ) : (
                      <div className={styles.otpSection}>
                        <div className={styles.otpHeader}>
                          <strong>XÁC THỰC THAY ĐỔI</strong>
                          <p>Mã OTP đã được gửi đến email của bạn. Vui lòng nhập mã để hoàn tất.</p>
                        </div>
                        <input
                          className={styles.otpInput}
                          placeholder="Mã OTP 6 số"
                          maxLength={6}
                          value={pwdForm.otp}
                          onChange={(e) => setPwdForm({ ...pwdForm, otp: e.target.value })}
                        />
                        <div className={styles.row2} style={{ marginTop: '20px' }}>
                          <button type="button" className={styles.ghost} onClick={() => setIsVerifyingPassword(false)}>Quay lại</button>
                          <button type="button" className={styles.primary} onClick={handleVerifyPasswordChange}>Xác nhận đổi mật khẩu</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.securityItem} style={{ opacity: 0.5, pointerEvents: 'none' }}>
                  <div className={styles.itemHead}>
                    <div>
                      <h4>Xác thực 2 lớp (2FA)</h4>
                      <p>Sử dụng ứng dụng xác thực để thêm lớp bảo mật (Sắp ra mắt).</p>
                    </div>
                    <button type="button" className={styles.ghost} disabled>Kích hoạt</button>
                  </div>
                </div>
              </div>
            </article>
          )}

          {activeTab !== "subscription" && activeTab !== "security" && (
            <div className={styles.footer}><button type="button" className={styles.ghost} onClick={load}>Hủy</button><button type="submit" className={styles.primary}>Lưu cấu hình</button></div>
          )}
        </div>

        {activeTab !== "subscription" && (
          <aside className={styles.sideCol}>
            <article className={styles.brandBox}><h3>Logo</h3><div className={styles.logo}>{settings.name.slice(0, 1)}</div><label className={styles.fileButton}><input type="file" hidden />Cập nhật logo</label></article>
          </aside>
        )}
      </form>

      {paymentStatus !== "idle" && (
        <div className={styles.payModal}>
          <div className={styles.payCard}>
            {paymentStatus === "pending" && <div className={styles.successState}><div className={styles.qrContainer}><img src={`https://img.vietqr.io/image/970415-0799021393-compact.png?amount=${calc?.amountToPay}&addInfo=MAVIX_UPGRADE_${selectedPlan.name.toUpperCase()}`} alt="QR" style={{ width: '100%' }} /></div><strong>QUÉT MÃ THANH TOÁN</strong><p>{calc?.amountToPay.toLocaleString()}đ</p></div>}
            {paymentStatus === "success" && <div className={styles.successState}><div className={styles.checkmark}>✓</div><h1>KÍCH HOẠT THÀNH CÔNG!</h1><p>Gói đã được cập nhật.</p></div>}
          </div>
        </div>
      )}
    </>
  );
}
