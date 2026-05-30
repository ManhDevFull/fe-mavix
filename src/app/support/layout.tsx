"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PublicLayout } from "../../components/public-layout";
import styles from "./support.module.css";

const NAV_ITEMS = [
    { label: "Tổng quan", href: "/support" },
    { label: "Hướng dẫn bắt đầu", href: "/support/guide" },
    { label: "Điều khoản dịch vụ", href: "/support/terms" },
    { label: "Chính sách bảo mật", href: "/support/privacy" },
];

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <PublicLayout>
            <div className={styles.wrapper}>
                {/* ── Sidebar ── */}
                <aside className={styles.sidebar}>
                    <p className={styles.sidebarLabel}>Trung tâm hỗ trợ</p>
                    <nav className={styles.sidebarNav}>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.sidebarLink} ${pathname === item.href ? styles.sidebarLinkActive : ""
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className={styles.sidebarContact}>
                        <p className={styles.sidebarContactLabel}>Cần thêm trợ giúp?</p>
                        <Link href="/contact" className={styles.sidebarContactBtn}>
                            Liên hệ chúng tôi →
                        </Link>
                    </div>
                </aside>

                {/* ── Content ── */}
                <main className={styles.content}>{children}</main>
            </div>
        </PublicLayout>
    );
}
