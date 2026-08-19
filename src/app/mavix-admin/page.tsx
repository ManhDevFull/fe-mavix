"use client";

import { useEffect, useState } from "react";
import styles from "./s-admin.module.css";
import { apiFetch } from "../../lib/api";

export default function SAdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/s-admin/stats")
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Đang tải dữ liệu hệ thống...</div>;

    return (
        <div>
            <header className={styles.header}>
                <h1>Trang quản lý hệ thống MAVIX</h1>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Tổng số quán</span>
                    <span className={styles.statValue}>{stats.totalRestaurants}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Dùng thử (Free)</span>
                    <span className={styles.statValue}>{stats.trialRestaurants}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Trả phí (Paid)</span>
                    <span className={styles.statValue} style={{ color: '#1dbb87' }}>{stats.paidRestaurants}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Thiết bị Online</span>
                    <span className={styles.statValue}>{stats.activeDevices}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Ticket đang mở</span>
                    <span className={styles.statValue} style={{ color: stats.openTickets > 0 ? '#f43f5e' : 'inherit' }}>
                        {stats.openTickets}
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Doanh thu tháng này</span>
                    <span className={styles.statValue}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.monthlyRevenue)}
                    </span>
                </div>
            </div>

            <section>
                <h3>Cảnh báo hệ thống</h3>
                <div className={styles.tableContainer} style={{ padding: '20px', color: '#64748b' }}>
                    Hiện chưa có cảnh báo kỹ thuật nào. Hệ thống đang hoạt động ổn định.
                </div>
            </section>
        </div>
    );
}
