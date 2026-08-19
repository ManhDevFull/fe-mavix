"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PublicLayout } from "../../components/public-layout";
import { useToast } from "../../components/toast-provider";
import { readAuth, saveAuth } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (readAuth()) {
      router.replace("/admin");
    }
  }, [router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = await apiFetch<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: {
          id: string;
          email: string;
          fullName: string;
          role: string;
        };
        restaurant: {
          id: number;
          name: string;
          slug: string;
        };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        auth: false,
        retry: false
      });

      saveAuth(payload);
      toast.success("Đăng nhập thành công", "Đang chuyển vào dashboard quản trị.");
      router.replace("/admin");
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Đăng nhập thất bại";
      setError(message);
      toast.error("Không đăng nhập được", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout noFooter>
      <main className={styles.page}>
        <section className={styles.shell}>
          <aside className={styles.brandPane}>
            <div className={styles.brandTop}>
              <div className={styles.brandMark}>MK</div>
              <h1>Metro Kitchen</h1>
              <p>Điều hành nhà hàng theo phong cách dashboard vận hành chuyên nghiệp.</p>
            </div>
            <div className={styles.brandBottom}>
              <strong>Truy cập tài khoản quản trị</strong>
              <p>Dùng tài khoản vừa đăng ký hoặc tài khoản quản trị bạn tự cấu hình.</p>
            </div>
          </aside>

          <div className={styles.formPane}>
            <p className={styles.eyebrow}>Đăng nhập quản trị</p>
            <h1>Đăng nhập hệ thống</h1>
            <p className={`${styles.subcopy} ${styles.loginSubcopy}`}>
              Truy cập dashboard để quản lý bàn, thực đơn, đơn hàng, thiết bị và các phiên đăng nhập.
            </p>

            <form className={`${styles.card} ${styles.loginCard}`} onSubmit={submit}>
              <label>
                <span>Email</span>
                <input
                  placeholder="Nhập email quản trị"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label>
                <span>Mật khẩu</span>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {error ? <p className={styles.error}>{error}</p> : null}
              <button type="submit" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Vào dashboard"}
              </button>
              <hr className={styles.divider} />
              <div className={styles.signup}>
                Nếu chưa có tài khoản?
                <a href="/register">Tạo tài khoản mới</a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
