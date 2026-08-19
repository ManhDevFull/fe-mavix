"use client";

import { useEffect, useState } from "react";
import styles from "../s-admin.module.css";
import { apiFetch } from "../../../lib/api";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/s-admin/inventory")
            .then((data: any) => setItems(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Đang tải kho thiết bị...</div>;

    return (
        <div>
            <header className={styles.header}>
                <h1>Quản lý thiết bị IoT</h1>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mã thiết bị</th>
                            <th>Loại</th>
                            <th>Lô hàng</th>
                            <th>Trạng thái</th>
                            <th>Quán đang dùng</th>
                            <th>Ngày kích hoạt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><b>{item.device_code}</b></td>
                                <td>{item.device_type}</td>
                                <td>{item.batch_number}</td>
                                <td>
                                    <span className={`${styles.badge} ${item.status === 'active' ? styles.badgeSuccess : styles.badgeWarn}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>{item.restaurant_name || "Trong kho"}</td>
                                <td>{item.activated_at ? new Date(item.activated_at).toLocaleDateString('vi-VN') : "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
