"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { clearAuth, hasStoredAuth } from "../lib/auth";
import { ApiError, apiFetch } from "../lib/api";
import { useToast } from "./toast-provider";
import styles from "./admin-shell.module.css";
import { useAdmin } from "./admin-context";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: "⊞" },
  { href: "/admin/tables", label: "Sơ đồ bàn", icon: "⊟" },
  { href: "/admin/orders", label: "Đơn hàng", icon: "☰" },
  { href: "/admin/menu", label: "Thực đơn", icon: "✕" },
  { href: "/admin/devices", label: "Thiết bị IoT", icon: "⟳" },
  { href: "/admin/reports", label: "Báo cáo", icon: "☐" },
  { href: "/admin/history", label: "Lịch sử", icon: "◷" },
  { href: "/admin/settings", label: "Cài đặt", icon: "⚙" },
  { href: "/admin/sessions", label: "Phiên đăng nhập", icon: "◫" }
];

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { title, description, setSlug, setPlan, setRestaurantId } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [clock, setClock] = useState("");
  const [profile, setProfile] = useState<{
    fullName: string;
    role: string;
    restaurantId: number;
    restaurantName: string;
    restaurantSlug: string;
    plan: "free" | "plus" | "pro" | "premium" | "edition";
  } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!hasStoredAuth()) {
      router.replace("/login");
      return;
    }

    apiFetch<{
      fullName: string;
      role: string;
      restaurantId: number;
      restaurantName: string;
      restaurantSlug: string;
      plan: "free" | "plus" | "pro" | "premium" | "edition";
    }>("/admin/me")
      .then((data) => {
        setProfile(data);
        setSlug(data.restaurantSlug);
        setPlan(data.plan || "free");
        setRestaurantId(data.restaurantId);
      })
      .catch((error) => {
        clearAuth();
        if (error instanceof ApiError && error.status === 401) {
          router.replace("/login");
          return;
        }
        toast.error("Không xác thực được phiên", "Vui lòng đăng nhập lại.");
        router.replace("/login");
      })
      .finally(() => setCheckingAuth(false));
  }, [router, toast, setSlug]);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const updateClock = () => setClock(formatter.format(new Date()));
    updateClock();
    const interval = window.setInterval(updateClock, 1000);

    // Heartbeat check every 60 seconds to ensure session is still valid
    const heartbeat = window.setInterval(() => {
      apiFetch("/admin/me")
        .catch((error) => {
          if (error instanceof ApiError && error.status === 401) {
            clearAuth();
            router.replace("/login");
          }
        });
    }, 60000);

    return () => {
      window.clearInterval(interval);
      window.clearInterval(heartbeat);
    };
  }, [router]);

  async function downloadReport() {
    try {
      const overview = await apiFetch<Record<string, unknown>>("/admin/overview");
      const blob = new Blob([JSON.stringify(overview, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `postcardqr-report-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.info("Chuyển sang báo cáo", "Không tải được file JSON, mở trang báo cáo thay thế.");
      router.push("/admin/reports");
    }
  }

  const brandInitials = (profile?.restaurantName ?? "Metro Kitchen")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "MK";

  if (checkingAuth) {
    return (
      <div className={styles.page}>
        <main className={styles.loadingState}>
          <div className={styles.loadingCard}>
            <strong>Đang xác thực phiên quản trị</strong>
            <p>Hệ thống đang kiểm tra quyền truy cập trước khi tải dashboard.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <div className={styles.brandIcon}>{brandInitials}</div>
          <div className={styles.brandName}>
            <h1>{profile?.restaurantName ?? "METRO KITCHEN"}</h1>
          </div>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? styles.active : ""}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.logout}
            onClick={async () => {
              try {
                await apiFetch("/admin/sessions/logout", { method: "POST" });
              } catch {
                // Ignore errors during logout
              }
              clearAuth();
              toast.info("Đã đăng xuất", "Phiên quản trị đã được thu hồi và xóa khỏi trình duyệt.");
              router.replace("/login");
            }}
          >
            Đăng xuất
          </button>
          <div className={styles.copyright}>
            <span>@Copyright by MADZ Coder</span>
          </div>
        </div>
      </aside>
      <main className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2>{title}</h2>
            <p className={styles.sectionTitle}>
              {description}
              {clock ? ` | ${clock}` : ""}
            </p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.actions}>
              <button className={styles.ghostAction} type="button" onClick={downloadReport}>
                Xuất báo cáo
              </button>
              <button
                className={styles.primaryAction}
                type="button"
                onClick={() => router.push("/admin/orders")}
              >
                + Đơn hàng mới
              </button>
            </div>
            <div className={styles.user}>{profile?.role ?? "owner"}</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
