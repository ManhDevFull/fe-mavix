"use client";

import { useEffect, useState } from "react";
import styles from "../s-admin.module.css";
import { apiFetch } from "../../../lib/api";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch<any[]>("/s-admin/customers")
            .then(setCustomers)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Đang tải danh sách quán...</div>;

    return (
        <div>
            <header className={styles.header}>
                <h1>Quản lý Khách hàng</h1>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Quán</th>
                            <th>Chủ Quán</th>
                            <th>Email / SĐT</th>
                            <th>Gói</th>
                            <th>Ngày đăng ký</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>
                                    <b>{c.name}</b><br />
                                    <small style={{ color: '#64748b' }}>{c.slug}</small>
                                </td>
                                <td>{c.owner_name}</td>
                                <td>
                                    {c.owner_email}<br />
                                    {c.owner_phone}
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${c.plan !== 'free' ? styles.badgeSuccess : styles.badgeWarn}`}>
                                        {c.plan}
                                    </span>
                                </td>
                                <td>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <button className={styles.badge} style={{ border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
