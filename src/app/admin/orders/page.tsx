"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../../../components/admin-shell";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import styles from "./orders.module.css";

type OrderBoard = Array<{
  orderId: number;
  displayName: string;
  tableCode: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  customerNote: string | null;
  items: Array<{
    id: number;
    itemName: string;
    quantity: number;
    status: string;
  }>;
}>;

import { useAdmin } from "../../../components/admin-context";

export default function OrdersPage() {
  const { setTitle, setDescription } = useAdmin();
  const toast = useToast();
  const [orders, setOrders] = useState<OrderBoard>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      setOrders(await apiFetch<OrderBoard>("/admin/orders"));
    } catch {
      setError("Không tải được danh sách đơn hàng. Kiểm tra lại phiên đăng nhập hoặc backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTitle("ĐƠN HÀNG ĐANG PHỤC VỤ");
    setDescription("Theo dõi món mới theo từng bàn, từng món, từng trạng thái phục vụ");
    void loadOrders();
  }, [setTitle, setDescription]);

  async function markServed(orderId: number, itemId: number) {
    try {
      await apiFetch(`/admin/orders/${orderId}/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "served" })
      });
      toast.success("Đã cập nhật món", "Trạng thái món đã chuyển sang đã phục vụ.");
      await loadOrders();
    } catch (error) {
      toast.error("Không cập nhật được món", error instanceof Error ? error.message : undefined);
    }
  }

  const getOrderLabel = (status: string) => {
    switch (status) {
      case "served":
        return "Đã phục vụ";
      default:
        return "Đang phục vụ";
    }
  };

  const getItemLabel = (status: string) => {
    switch (status) {
      case "served":
        return "Đã lên món";
      default:
        return "Mới";
    }
  };

  const unpaidOrders = orders.filter((order) => order.paymentStatus !== "paid");

  return (
    <>
      <section className={styles.summaryBar}>
        <div>
          <span>Tổng đơn</span>
          <strong>{unpaidOrders.length}</strong>
        </div>
        <div>
          <span>Đã phục vụ</span>
          <strong>{unpaidOrders.filter((order) => order.orderStatus === "served").length}</strong>
        </div>
        <div>
          <span>Đang chờ</span>
          <strong>{unpaidOrders.filter((order) => order.orderStatus !== "served").length}</strong>
        </div>
      </section>

      {loading ? <div className={styles.emptyState}>Đang tải đơn hàng...</div> : null}
      {error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
          <button type="button" onClick={() => loadOrders()}>
            Thử lại
          </button>
        </div>
      ) : null}

      <section className={styles.grid}>
        {!loading && !error && unpaidOrders.length === 0 ? (
          <div className={styles.emptyState}>
            Chưa có đơn nào chưa thanh toán. Khi khách gọi món, thẻ đơn sẽ xuất hiện ở đây.
          </div>
        ) : null}

        {!loading &&
          !error &&
          unpaidOrders.map((order) => (
            <article key={order.orderId} className={styles.card}>
              <div className={styles.header}>
                <div>
                  <p>Bàn {order.tableCode}</p>
                  <h3>{order.displayName}</h3>
                </div>
                <span>{getOrderLabel(order.orderStatus)}</span>
              </div>
              {order.customerNote ? <small>Ghi chú: {order.customerNote}</small> : null}
              <div className={styles.items}>
                {order.items.map((item) => {
                  const served = item.status === "served";
                  return (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemBody}>
                        <strong>
                          {item.quantity}x {item.itemName}
                        </strong>
                        <p>{getItemLabel(item.status)}</p>
                      </div>
                      <div className={styles.statusIcon} data-served={served ? "1" : "0"}>
                        {served ? "✓" : "•"}
                      </div>
                      <button
                        type="button"
                        onClick={() => markServed(order.orderId, item.id)}
                        disabled={served}
                      >
                        {served ? "Đã phục vụ" : "Đã lên món"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className={styles.totalRow}>
                <span>Thành tiền</span>
                <strong>{order.total.toLocaleString("vi-VN")}đ</strong>
              </div>
            </article>
          ))}
      </section>
    </>
  );
}
