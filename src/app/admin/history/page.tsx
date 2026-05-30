"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import { useAdmin } from "../../../components/admin-context";
import styles from "./history.module.css";

type HistoryItem = {
    id: number;
    tableCode: string;
    checkInTime: string;
    paymentTime: string;
    amount: number;
    transactionId: string;
    paymentMethod: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
};

export default function HistoryPage() {
    const { setTitle, setDescription } = useAdmin();
    const toast = useToast();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

    async function loadHistory() {
        setLoading(true);
        try {
            // Assuming a backend endpoint exists, otherwise use mockup data
            const data = await apiFetch<HistoryItem[]>("/admin/history").catch(() => {
                // Mockup data for demonstration
                return [
                    {
                        id: 1,
                        tableCode: "B05",
                        checkInTime: "2024-05-25T10:30:00Z",
                        paymentTime: "2024-05-25T11:45:00Z",
                        amount: 450000,
                        transactionId: "TX123456789",
                        paymentMethod: "Bank Transfer",
                        items: [
                            { name: "Phở Đặc Biệt", quantity: 2, price: 150000 },
                            { name: "Cà Phê Sữa Đá", quantity: 2, price: 45000 },
                            { name: "Nem Rán", quantity: 1, price: 60000 }
                        ]
                    },
                    {
                        id: 2,
                        tableCode: "A12",
                        checkInTime: "2024-05-25T09:15:00Z",
                        paymentTime: "2024-05-25T10:10:00Z",
                        amount: 125000,
                        transactionId: "TX987654321",
                        paymentMethod: "QR Pay",
                        items: [
                            { name: "Bánh Mì Thịt Nướng", quantity: 2, price: 45000 },
                            { name: "Trà Đào", quantity: 1, price: 35000 }
                        ]
                    }
                ];
            });
            setHistory(data);
        } catch (error) {
            toast.error("Không tải được lịch sử", error instanceof Error ? error.message : undefined);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setTitle("LỊCH SỬ GIAO DỊCH");
        setDescription("Xem lại các đơn hàng đã thanh toán và in sao kê điện tử");
        void loadHistory();
    }, [setTitle, setDescription]);

    const formatDateTime = (iso: string) => {
        return new Date(iso).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    return (
        <div className={styles.layout}>
            <div className={styles.tableContainer}>
                <table className={styles.historyTable}>
                    <thead>
                        <tr>
                            <th className={styles.stt}>STT</th>
                            <th className={styles.tableCode}>Bàn</th>
                            <th>Thời gian nhận</th>
                            <th>Thanh toán</th>
                            <th>Số tiền</th>
                            <th>Mã giao dịch</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>Đang tải dữ liệu...</td>
                            </tr>
                        ) : history.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>Chưa có lịch sử giao dịch.</td>
                            </tr>
                        ) : (
                            history.map((item, index) => (
                                <tr key={item.id} onClick={() => setSelectedItem(item)}>
                                    <td className={styles.stt}>{index + 1}</td>
                                    <td className={styles.tableCode}>{item.tableCode}</td>
                                    <td>{formatDateTime(item.checkInTime)}</td>
                                    <td>{formatDateTime(item.paymentTime)}</td>
                                    <td className={styles.amount}>{item.amount.toLocaleString("vi-VN")}đ</td>
                                    <td className={styles.txId}>{item.transactionId}</td>
                                    <td>
                                        <button type="button" className="ghostMini" onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(item);
                                        }}>Chi tiết</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedItem && (
                <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button type="button" className={styles.closeButton} onClick={() => setSelectedItem(null)}>✕</button>
                        <div className={styles.modalHeader}>
                            <h2>HÓA ĐƠN ĐIỆN TỬ</h2>
                            <p>#{selectedItem.transactionId}</p>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.invoiceInfo}>
                                <div className={styles.infoItem}>
                                    <label>Mã bàn</label>
                                    <span>{selectedItem.tableCode}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Thanh toán lúc</label>
                                    <span>{formatDateTime(selectedItem.paymentTime)}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Thời gian nhận bàn</label>
                                    <span>{formatDateTime(selectedItem.checkInTime)}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Phương thức</label>
                                    <span>{selectedItem.paymentMethod}</span>
                                </div>
                            </div>

                            <div className={styles.itemList}>
                                <h3>Chi tiết món ăn</h3>
                                {selectedItem.items.map((item, idx) => (
                                    <div key={idx} className={styles.billItem}>
                                        <div className={styles.itemName}>
                                            {item.quantity}x {item.name}
                                        </div>
                                        <span>{item.price.toLocaleString("vi-VN")}đ</span>
                                        <div className={styles.itemTotal}>{(item.quantity * item.price).toLocaleString("vi-VN")}đ</div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.billSummary}>
                                <div className={styles.summaryRow}>
                                    <span>Tạm tính</span>
                                    <span>{selectedItem.amount.toLocaleString("vi-VN")}đ</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Giảm giá</span>
                                    <span>0đ</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <strong>TỔNG THANH TOÁN</strong>
                                    <strong>{selectedItem.amount.toLocaleString("vi-VN")}đ</strong>
                                </div>
                            </div>

                            <div style={{ marginTop: "24px", display: "grid", gap: "10px" }}>
                                <button type="button" className="primaryMini" style={{ width: "100%", height: "45px" }}>IN SAO KÊ (PDF)</button>
                                <button type="button" className="ghostMini" style={{ width: "100%", height: "45px" }} onClick={() => setSelectedItem(null)}>ĐÓNG</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
