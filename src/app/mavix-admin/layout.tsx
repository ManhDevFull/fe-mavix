"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./s-admin.module.css";
import { apiFetch } from "../../lib/api";

export default function SAdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const userData = await apiFetch<{ role: string; fullName: string }>("/admin/me");
                if (!userData.role.startsWith("s_")) {
                    router.push("/admin"); // Not a system admin
                    return;
                }
                setUser(userData);
            } catch (err) {
                router.push("/login?callback=/mavix-admin");
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, [router]);

    if (loading) return <div className={styles.layout}>Loading system...</div>;
    if (!user) return null;

    const navItems = [
        { label: "Dashboard", href: "/mavix-admin" },
        { label: "Khách hàng", href: "/mavix-admin/customers" },
        { label: "Gói dịch vụ", href: "/mavix-admin/plans" },
        { label: "Kho Thiết bị", href: "/mavix-admin/inventory" },
        { label: "Ticket Hỗ trợ", href: "/mavix-admin/tickets" },
        { label: "Nhân sự nội bộ", href: "/mavix-admin/staff" },
        { label: "Audit Log", href: "/mavix-admin/logs" },
    ];

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <h2>MAVIX SYSTEM</h2>
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ""}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div style={{ marginTop: 'auto', padding: '10px 0', borderTop: '1px solid #334155', fontSize: '0.8rem', color: '#64748b' }}>
                    Đang đăng nhập: <b>{user.fullName}</b>
                </div>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
