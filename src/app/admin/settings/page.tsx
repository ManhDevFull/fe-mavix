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
  qrBankName: string | null;
  qrBankAccountName: string | null;
  qrBankAccountNumber: string | null;
  qrPaymentPrefix: string | null;
  publicMenuUrl: string;
};

type TabKey = "general" | "brand" | "staff" | "payment" | "security" | "subscription";

export default function SettingsPage() {
  const { setTitle, setDescription } = useAdmin();
  const toast = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [logoName, setLogoName] = useState("Chưa tải file");
  const [currentPlan, setCurrentPlan] = useState("Pro");

  async function load() {
    setSettings(await apiFetch<Settings>("/admin/settings"));
  }

  useEffect(() => {
    setTitle("CÀI ĐẶT HỆ THỐNG");
    setDescription("Cấu hình hồ sơ nhà hàng, QR thanh toán và thương hiệu");
    load().catch((error) =>
      toast.error("Không tải được cài đặt", error instanceof Error ? error.message : undefined)
    );
  }, [setTitle, setDescription]);

  async function saveWorkspace(event: FormEvent) {
    event.preventDefault();
    if (!settings) {
      return;
    }

    try {
      setSettings(
        await apiFetch<Settings>("/admin/settings", {
          method: "PATCH",
          body: JSON.stringify(settings)
        })
      );
      toast.success("Đã lưu cài đặt", "Thông tin nhà hàng và cấu hình QR đã được cập nhật.");
    } catch (error) {
      toast.error("Không lưu được cài đặt", error instanceof Error ? error.message : undefined);
    }
  }

  const panelTitle = useMemo(() => {
    switch (activeTab) {
      case "brand":
        return "Thương hiệu";
      case "staff":
        return "Nhân viên";
      case "payment":
        return "Thanh toán QR";
      case "security":
        return "Bảo mật";
      case "subscription":
        return "Gói quản lý";
      default:
        return "Chung";
    }
  }, [activeTab]);

  if (!settings) {
    return null;
  }

  const plans = [
    {
      name: "Free",
      price: "0",
      label: "Dùng QR order cơ bản",
      desc: "Hệ thống xem QR như một mã tĩnh chuyên nghiệp.",
      features: [
        "QR order cho từng bàn",
        "Gọi món bằng QR",
        "Đồng bộ đơn hàng cơ bản",
        "✕ Dashboard thiết bị",
        "✕ Theo dõi online/offline",
        "✕ Realtime IoT / Firmware"
      ]
    },
    {
      name: "Plus",
      price: "199.000",
      label: "Bắt đầu quản lý QR IoT",
      desc: "Khởi động quản lý hệ thống thiết bị phần cứng.",
      features: [
        "Tất cả tính năng FREE",
        "Dashboard quản lý thiết bị",
        "Xem trạng thái online/offline",
        "Đồng bộ realtime cơ bản",
        "Ping thiết bị / Sync bàn",
        "Báo cáo vận hành cơ sở"
      ]
    },
    {
      name: "Pro",
      price: "499.000",
      label: "Vận hành IoT chuyên nghiệp",
      desc: "Tối ưu hiệu suất và bảo mật cho thiết bị.",
      features: [
        "Tất cả tính năng PLUS",
        "Heartbeat monitoring",
        "Sửa lỗi kết nối tự động",
        "QR Token động (Anti-fake)",
        "Nhật ký hoạt động thiết bị",
        "Realtime Dashboard nâng cao"
      ]
    },
    {
      name: "Premium",
      price: "999.000",
      label: "Hệ thống IoT Enterprise",
      desc: "Giải pháp quản trị từ xa và bảo mật đa tầng.",
      features: [
        "Tất cả tính năng PRO",
        "Cập nhật Firmware từ xa (OTA)",
        "Remote Reboot / Blacklist",
        "Device Auth Token bảo mật",
        "Auto Recovery / Retry queue",
        "Báo cáo lỗi & Giám sát ưu tiên"
      ]
    },
    {
      name: "Edition",
      price: "Custom",
      label: "Giải pháp May đo",
      desc: "Hệ thống riêng biệt cho quy mô cực lớn.",
      features: [
        "Multi-zone sync chuyên sâu",
        "SLA cam kết 99.99%",
        "Hạ tầng Server riêng biệt",
        "Tích hợp API/Webhook riêng",
        "Bảo mật đa tầng Enterprise",
        "Chuyên gia vận hành riêng"
      ]
    }
  ];

  return (
    <>
      <section className={styles.tabs}>
        {([
          ["general", "Chung"],
          ["brand", "Thương hiệu"],
          ["staff", "Nhân viên"],
          ["payment", "Thanh toán QR"],
          ["security", "Bảo mật"],
          ["subscription", "Gói quản lý"]
        ] as Array<[TabKey, string]>).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={activeTab === key ? styles.active : ""}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </section>

      <form
        className={`${styles.layout} ${activeTab === "subscription" ? styles.fullWidth : ""}`}
        onSubmit={saveWorkspace}
      >
        <div className={styles.mainCol}>
          {activeTab === "general" ? (
            <>
              <article className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Hồ sơ nhà hàng</h3>
                  <span>{panelTitle}</span>
                </div>
                <div className={styles.row2}>
                  <label>
                    <span>Tên nhà hàng</span>
                    <input
                      value={settings.name}
                      onChange={(event) =>
                        setSettings((current) =>
                          current ? { ...current, name: event.target.value } : current
                        )
                      }
                    />
                  </label>
                  <label>
                    <span>Số điện thoại</span>
                    <input
                      value={settings.phone ?? ""}
                      onChange={(event) =>
                        setSettings((current) =>
                          current ? { ...current, phone: event.target.value } : current
                        )
                      }
                    />
                  </label>
                </div>
                <label>
                  <span>Địa chỉ</span>
                  <textarea
                    value={settings.address ?? ""}
                    onChange={(event) =>
                      setSettings((current) =>
                        current ? { ...current, address: event.target.value } : current
                      )
                    }
                  />
                </label>
              </article>

              <article className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Tổng quan công khai</h3>
                  <span>Menu QR</span>
                </div>
                <p className={styles.url}>Slug quán: {settings.slug}</p>
                <p className={styles.url}>Link menu công khai: {settings.publicMenuUrl}</p>
              </article>
            </>
          ) : null}

          {activeTab === "brand" ? (
            <article className={styles.panel}>
              <div className={styles.panelHead}>
                <h3>Tùy chỉnh thương hiệu</h3>
                <span>{panelTitle}</span>
              </div>
              <div className={styles.row2}>
                <label>
                  <span>Tên hiển thị</span>
                  <input
                    value={settings.name}
                    onChange={(event) =>
                      setSettings((current) =>
                        current ? { ...current, name: event.target.value } : current
                      )
                    }
                  />
                </label>
                <label>
                  <span>Slug công khai</span>
                  <input value={settings.slug} disabled />
                </label>
              </div>
              <label>
                <span>Giới thiệu ngắn</span>
                <textarea
                  value={settings.address ?? ""}
                  onChange={(event) =>
                    setSettings((current) =>
                      current ? { ...current, address: event.target.value } : current
                    )
                  }
                />
              </label>
            </article>
          ) : null}

          {activeTab === "staff" ? (
            <article className={styles.panel}>
              <div className={styles.panelHead}>
                <h3>Nhân sự & phân quyền</h3>
                <span>{panelTitle}</span>
              </div>
              <div className={styles.staffGrid}>
                <div className={styles.staffCard}>
                  <strong>Chủ quán</strong>
                  <p>{settings.name}</p>
                </div>
                <div className={styles.staffCard}>
                  <strong>Quản lý ca</strong>
                  <p>Chưa cấu hình</p>
                </div>
                <div className={styles.staffCard}>
                  <strong>Thu ngân</strong>
                  <p>Chưa cấu hình</p>
                </div>
                <div className={styles.staffCard}>
                  <strong>Phục vụ</strong>
                  <p>Chưa cấu hình</p>
                </div>
              </div>
              <p className={styles.url}>Phần phân quyền chi tiết sẽ nối vào auth role sau.</p>
            </article>
          ) : null}

          {activeTab === "payment" ? (
            <article className={styles.panel}>
              <div className={styles.panelHead}>
                <h3>Tùy chỉnh thanh toán QR</h3>
                <span>Hiển thị công khai</span>
              </div>
              <div className={styles.row2}>
                <label>
                  <span>Ngân hàng</span>
                  <input
                    value={settings.qrBankName ?? ""}
                    onChange={(event) =>
                      setSettings((current) =>
                        current ? { ...current, qrBankName: event.target.value } : current
                      )
                    }
                  />
                </label>
                <label>
                  <span>Tiền tố nội dung</span>
                  <input
                    value={settings.qrPaymentPrefix ?? ""}
                    onChange={(event) =>
                      setSettings((current) =>
                        current ? { ...current, qrPaymentPrefix: event.target.value } : current
                      )
                    }
                  />
                </label>
              </div>
              <div className={styles.row2}>
                <label>
                  <span>Chủ tài khoản</span>
                  <input
                    value={settings.qrBankAccountName ?? ""}
                    onChange={(event) =>
                      setSettings((current) =>
                        current ? { ...current, qrBankAccountName: event.target.value } : current
                      )
                    }
                  />
                </label>
                <label>
                  <span>Số tài khoản</span>
                  <input
                    value={settings.qrBankAccountNumber ?? ""}
                    onChange={(event) =>
                      setSettings((current) =>
                        current ? { ...current, qrBankAccountNumber: event.target.value } : current
                      )
                    }
                  />
                </label>
              </div>
              <p className={styles.url}>Link menu công khai: {settings.publicMenuUrl}</p>
            </article>
          ) : null}

          {activeTab === "security" ? (
            <article className={styles.panel}>
              <div className={styles.panelHead}>
                <h3>Bảo mật & phiên</h3>
                <span>{panelTitle}</span>
              </div>
              <div className={styles.securityList}>
                <div className={styles.securityRow}>
                  <strong>Access token</strong>
                  <p>Hết hạn sau 10 phút</p>
                </div>
                <div className={styles.securityRow}>
                  <strong>Refresh token</strong>
                  <p>Hiệu lực 30 ngày, quản lý đa thiết bị</p>
                </div>
                <div className={styles.securityRow}>
                  <strong>Menu URL</strong>
                  <p>{settings.publicMenuUrl}</p>
                </div>
              </div>
              <p className={styles.url}>Phiên đăng nhập hiện được quản lý trực tiếp tại trang phiên đăng nhập.</p>
            </article>
          ) : null}

          {activeTab === "subscription" ? (
            <article className={styles.panel}>
              <div className={styles.panelHead}>
                <h3>Đăng ký gói quản lý</h3>
                <span>{panelTitle}</span>
              </div>
              <div className={styles.plansGrid}>
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`${styles.planCard} ${currentPlan === plan.name ? styles.activePlan : ""}`}
                  >
                    <div className={styles.planInfo}>
                      <strong>{plan.name}</strong>
                      <p>{plan.label}</p>
                      <span>{plan.desc}</span>
                    </div>

                    <ul className={styles.featureList}>
                      {plan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>

                    <div className={styles.price}>
                      <b>{plan.price}{plan.price !== "Custom" ? "đ" : ""}</b>
                      <span>{plan.price !== "Custom" ? "/ tháng" : "Liên hệ"}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.planBtn}
                      disabled={currentPlan === plan.name}
                      onClick={() => {
                        if (plan.name === "Edition") {
                          window.open("mailto:support@postcardqr.vn?subject=Contact for Edition Plan");
                          return;
                        }
                        setCurrentPlan(plan.name);
                        toast.success(`Đã chọn gói ${plan.name}`, "Hệ thống sẽ cập nhật giới hạn tài khoản của bạn.");
                      }}
                    >
                      {plan.name === "Edition" ? "Liên hệ" : (currentPlan === plan.name ? "Đang sử dụng" : "Nâng cấp")}
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </div>

        {activeTab !== "subscription" && (
          <aside className={styles.sideCol}>
            <article className={styles.brandBox}>
              <h3>Logo thương hiệu</h3>
              <div className={styles.logo}>{logoName.slice(0, 1)}</div>
              <label className={styles.fileButton}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setLogoName(file?.name ?? "Chưa tải file");
                  }}
                />
                Tải ảnh lên
              </label>
              <p>{logoName}</p>
            </article>

            <article className={styles.brandBox}>
              <h3>Màu sắc chủ đạo</h3>
              <div className={styles.palette}>
                <i className={styles.p1} />
                <i className={styles.p2} />
                <i className={styles.p3} />
                <i className={styles.p4} />
              </div>
            </article>
          </aside>
        )}

        {activeTab !== "subscription" && (
          <div className={styles.footer}>
            <button type="button" className={styles.ghost}>
              Hủy bỏ
            </button>
            <button type="submit" className={styles.primary}>
              Lưu thay đổi
            </button>
          </div>
        )}
      </form>
    </>
  );
}
