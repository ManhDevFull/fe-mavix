"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ArrowRight, ArrowLeft, Building2, User, ShieldCheck } from "lucide-react";
import { PublicLayout } from "../../components/public-layout";
import { useToast } from "../../components/toast-provider";
import { apiFetch } from "../../lib/api";
import { safeStorage } from "../../lib/auth";
import loginStyles from "../login/login.module.css";
import styles from "./register.module.css";

type Step = 1 | 2 | 3 | 4;

export default function RegisterPage() {
    const router = useRouter();
    const toast = useToast();

    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);

    // Form Data
    const [formData, setFormData] = useState({
        restaurantName: "",
        email: "",
        password: "",
        address: "",
        city: "",
        phone: "",
        businessType: "cafe",
        otp: ["", "", "", "", "", ""]
    });

    // Init Data Persistence
    useEffect(() => {
        const saved = safeStorage.getItem("register_temp");
        if (saved) {
            try {
                const { step: savedStep, data, timestamp } = JSON.parse(saved);
                // Expire after 1 hour
                if (Date.now() - timestamp < 3600000) {
                    setFormData(prev => ({ ...prev, ...data }));
                    setStep(savedStep || 1);
                } else {
                    safeStorage.removeItem("register_temp");
                }
            } catch (e) {
                safeStorage.removeItem("register_temp");
            }
        }
    }, []);

    // Persistence Sync
    useEffect(() => {
        if (step < 4) {
            safeStorage.setItem("register_temp", JSON.stringify({
                step,
                data: { ...formData, otp: ["", "", "", "", "", ""] },
                timestamp: Date.now()
            }));
        }
    }, [step, formData]);

    // Resend Timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const updateField = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const digit = value.slice(-1);
        const newOtp = [...formData.otp];
        newOtp[index] = digit;
        updateField("otp", newOtp);

        if (digit && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    // Auto-submit OTP
    useEffect(() => {
        if (step === 3 && formData.otp.every(v => v !== "")) {
            processNextStep();
        }
    }, [formData.otp, step]);

    async function processNextStep() {
        setError("");
        setLoading(true);

        try {
            if (step === 1) {
                if (!formData.email.includes("@")) throw new Error("Email không hợp lệ");
                if (formData.password.length < 8) throw new Error("Mật khẩu phải tối thiểu 8 ký tự");
                setStep(2);
            } else if (step === 2) {
                const result = await apiFetch<{
                    ok: boolean;
                    message: string;
                    deliveryMode?: "smtp" | "console";
                    debugCode?: string;
                }>("/auth/request-otp", {
                    method: "POST",
                    body: JSON.stringify({ email: formData.email }),
                    auth: false
                });
                toast.success(
                    "Đã gửi mã xác thực",
                    result.deliveryMode === "console" && result.debugCode
                        ? `Mã thử nghiệm: ${result.debugCode}`
                        : "Vui lòng kiểm tra email của bạn."
                );
                setStep(3);
                setResendCooldown(32);
            } else if (step === 3) {
                await apiFetch("/auth/register", {
                    method: "POST",
                    body: JSON.stringify({ ...formData, otp: formData.otp.join("") }),
                    auth: false
                });
                safeStorage.removeItem("register_temp");
                setStep(4);
                setTimeout(() => router.replace("/admin"), 3500);
            }
        } catch (err: any) {
            let msg = err.message || "Thao tác thất bại";
            // Filter technical NestJS errors
            if (msg.includes("Cannot POST")) {
                msg = "Hệ thống đang bảo trì tính năng này. Vui lòng thử lại sau.";
            }
            toast.error("Thông báo", msg);
        } finally {
            setLoading(false);
        }
    }

    const handleResend = async () => {
        if (resendCooldown > 0 || loading) return;
        setLoading(true);
        try {
            const result = await apiFetch<{
                ok: boolean;
                message: string;
                deliveryMode?: "smtp" | "console";
                debugCode?: string;
            }>("/auth/request-otp", {
                method: "POST",
                body: JSON.stringify({ email: formData.email }),
                auth: false
            });
            toast.success(
                "Đã gửi lại mã",
                result.deliveryMode === "console" && result.debugCode ? `Mã thử nghiệm: ${result.debugCode}` : undefined
            );
            setResendCooldown(60);
        } catch (e) {
            toast.error("Không thể gửi lại mã");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout noFooter>
            <main className={loginStyles.page}>
                <section className={loginStyles.shell}>
                    <aside className={loginStyles.brandPane}>
                        <div className={loginStyles.brandTop}>
                            <div className={loginStyles.brandMark}>MK</div>
                            <h1>Metro Kitchen</h1>
                            <motion.p
                                key={`p-${step}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            >
                                {step === 1 && "Bắt đầu xây dựng hệ thống quản trị QR IoT hiện đại cho không gian của bạn."}
                                {step === 2 && "Cung cấp thông tin địa lý giúp chúng tôi tối ưu hóa sơ đồ bàn và múi giờ vận hành."}
                                {step === 3 && "Chúng tôi đã gửi mã xác thực 6 số. Đây là bước cuối cùng để bảo mật không gian của bạn."}
                                {step === 4 && "Hệ thống đang thiết lập cơ sở dữ liệu, phân quyền và workspace mặc định."}
                            </motion.p>
                        </div>
                        <div className={loginStyles.brandBottom}>
                            <div className={styles.stepperMini}>
                                <motion.div
                                    className={styles.lineActive}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step / 3) * 100}%` }}
                                    style={{ height: "100%" }}
                                />
                            </div>
                            <p style={{ marginTop: 12, fontWeight: 900, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                {step < 4 ? `Giai đoạn ${step} trên 3` : "Khởi tạo thành công"}
                            </p>
                        </div>
                    </aside>

                    <div className={loginStyles.formPane}>
                        {step < 4 && (
                            <nav className={styles.stepper}>
                                <div className={`${styles.stepItem} ${step >= 1 ? styles.stepActive : ""}`}>
                                    <div className={styles.stepCircle}>{step > 1 ? <Check size={14} strokeWidth={4} /> : 1}</div>
                                    Tài khoản
                                </div>
                                <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineActive : ""}`} />
                                <div className={`${styles.stepItem} ${step >= 2 ? styles.stepActive : ""}`}>
                                    <div className={styles.stepCircle}>{step > 2 ? <Check size={14} strokeWidth={4} /> : 2}</div>
                                    Nhà hàng
                                </div>
                                <div className={`${styles.stepLine} ${step >= 3 ? styles.stepLineActive : ""}`} />
                                <div className={`${styles.stepItem} ${step >= 3 ? styles.stepActive : ""}`}>
                                    <div className={styles.stepCircle}>3</div>
                                    Xác minh
                                </div>
                            </nav>
                        )}

                        <div className={styles.sliderContainer}>
                            <AnimatePresence mode="wait" initial={false}>
                                {step === 1 && (
                                    <motion.form
                                        key="s1"
                                        className={styles.stepPane}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        onSubmit={(e) => { e.preventDefault(); processNextStep(); }}
                                    >
                                        <p className={loginStyles.eyebrow}>Đăng ký ngay</p>
                                        <h1 className={loginStyles.formPane} style={{ padding: 0, marginBottom: 12 }}>Tạo tài khoản mới</h1>
                                        <p className={loginStyles.subcopy}>Thông tin đăng nhập chìa khóa để quản trị toàn bộ hệ thống MK.</p>

                                        <div className={loginStyles.card}>
                                            <label>
                                                <span>Tên quán của bạn</span>
                                                <input required placeholder="VD: Metro Coffee" value={formData.restaurantName} onChange={e => updateField("restaurantName", e.target.value)} />
                                            </label>
                                            <label>
                                                <span>Email quản trị</span>
                                                <input type="email" required placeholder="owner@kitchen.com" value={formData.email} onChange={e => updateField("email", e.target.value)} />
                                            </label>
                                            <label>
                                                <span>Mật khẩu</span>
                                                <input type="password" required placeholder="Tối thiểu 8 ký tự" value={formData.password} onChange={e => updateField("password", e.target.value)} />
                                                {formData.password && formData.password.length < 8 && <p style={{ color: "var(--danger)", fontSize: "0.7rem", margin: 0, fontWeight: 800 }}>Mật khẩu quá ngắn</p>}
                                            </label>

                                            <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                                                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Tiếp tục <ArrowRight size={18} /></>}
                                            </button>
                                            <hr className={loginStyles.divider} />
                                            <div className={loginStyles.signup}>Đã có tài khoản? <a href="/login">Đăng nhập</a></div>
                                        </div>
                                    </motion.form>
                                )}

                                {step === 2 && (
                                    <motion.form
                                        key="s2"
                                        className={styles.stepPane}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        onSubmit={(e) => { e.preventDefault(); processNextStep(); }}
                                    >
                                        <p className={loginStyles.eyebrow}>Thiết lập</p>
                                        <h1 className={loginStyles.formPane} style={{ padding: 0, marginBottom: 12 }}>Thông tin vận hành</h1>
                                        <p className={loginStyles.subcopy}>Địa chỉ và loại hình kinh doanh giúp tối ưu hóa dashboard.</p>

                                        <div className={loginStyles.card}>
                                            <label>
                                                <span>Địa chỉ nhà hàng</span>
                                                <textarea required placeholder="Số nhà, đường, phường/xã..." value={formData.address} onChange={e => updateField("address", e.target.value)} />
                                            </label>
                                            <div className={styles.fieldRow}>
                                                <label>
                                                    <span>Tỉnh / Thành phố</span>
                                                    <input required placeholder="Hà Nội" value={formData.city} onChange={e => updateField("city", e.target.value)} />
                                                </label>
                                                <label>
                                                    <span>Hotline quán</span>
                                                    <input required placeholder="09xxxxxx" value={formData.phone} onChange={e => updateField("phone", e.target.value)} />
                                                </label>
                                            </div>
                                            <label>
                                                <span>Mô hình kinh doanh</span>
                                                <select style={{ height: 44, border: "2px solid var(--border)", font: "inherit", padding: "0 12px", background: "white" }} value={formData.businessType} onChange={e => updateField("businessType", e.target.value)}>
                                                    <option value="cafe">Quán Cafe</option>
                                                    <option value="milk_tea">Trà sữa</option>
                                                    <option value="restaurant">Nhà hàng / Quán ăn</option>
                                                </select>
                                            </label>

                                            <button type="submit" disabled={loading}>{loading ? "Đang xử lý..." : "Gửi mã OTP"}</button>
                                            <button type="button" onClick={() => setStep(1)} style={{ background: "transparent", border: "0", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 900, textTransform: "uppercase", fontSize: "0.8rem", color: "var(--text-muted)", cursor: "pointer" }}>
                                                <ArrowLeft size={16} /> Quay lại Bước 1
                                            </button>
                                        </div>
                                    </motion.form>
                                )}

                                {step === 3 && (
                                    <motion.form
                                        key="s3"
                                        className={styles.stepPane}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        onSubmit={(e) => { e.preventDefault(); processNextStep(); }}
                                    >
                                        <p className={loginStyles.eyebrow}>Xác thực</p>
                                        <h1 className={loginStyles.formPane} style={{ padding: 0, marginBottom: 12 }}>Xác minh Email</h1>
                                        <p className={loginStyles.subcopy}>Nhập mã 6 số được gửi tới <strong>{formData.email}</strong>.</p>

                                        <div className={loginStyles.card}>
                                            <div className={styles.otpGrid}>
                                                {[0, 1, 2, 3, 4, 5].map(i => (
                                                    <input key={i} id={`otp-${i}`} className={styles.otpInput} value={formData.otp[i]} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)} autoFocus={i === 0} maxLength={1} />
                                                ))}
                                            </div>
                                            <div className={styles.resendRow}>
                                                <span style={{ fontSize: "0.84rem", color: "var(--text-muted)", fontWeight: 800 }}>{resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : "Chưa có mã?"}</span>
                                                <button type="button" className={styles.resendBtn} disabled={resendCooldown > 0 || loading} onClick={handleResend}>Gửi lại mã</button>
                                            </div>

                                            <button type="submit" disabled={loading || formData.otp.some(v => !v)} style={{ marginTop: 20 }}>{loading ? "Đang xác thực..." : "Xác nhận & Hoàn tất"}</button>
                                        </div>
                                    </motion.form>
                                )}

                                {step === 4 && (
                                    <motion.div key="success" className={styles.successOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <motion.div className={styles.check} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
                                            <Check size={36} strokeWidth={4} />
                                        </motion.div>
                                        <div>
                                            <h1 style={{ margin: "0 0 8px", textTransform: "uppercase", fontWeight: 950, fontSize: "1.8rem" }}>Thiết lập hoàn tất</h1>
                                            <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: 800 }}>Workspace của bạn đang được khởi tạo...</p>
                                        </div>
                                        <div className={styles.initList}>
                                            {[
                                                { icon: <User size={16} />, text: "Ghi nhận tài khoản Owner" },
                                                { icon: <Building2 size={16} />, text: "Khởi tạo Restaurant Workspace" },
                                                { icon: <ShieldCheck size={16} />, text: "Phân quyền quản trị hệ thống" },
                                                { icon: <Loader2 size={16} className="animate-spin" />, text: "Đang mở Dashboard..." }
                                            ].map((item, i) => (
                                                <motion.div key={i} className={styles.initItem} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4 }}>
                                                    <span style={{ color: "var(--accent)" }}>{item.icon}</span>
                                                    {item.text}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}
