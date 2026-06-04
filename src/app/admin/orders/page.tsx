"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import styles from "./orders.module.css";
import { useAdmin } from "../../../components/admin-context";

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
    item_name: string; // Fixed: using item_name from DB
    quantity: number;
    status: string;
    unitPrice: number;
  }>;
}>;

export default function OrdersPage() {
  const { setTitle, setDescription, socket } = useAdmin();
  const toast = useToast();
  const [orders, setOrders] = useState<OrderBoard>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [billRequests, setBillRequests] = useState<Set<string>>(new Set());

  const loadOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");

    try {
      setOrders(await apiFetch<OrderBoard>("/admin/orders"));
    } catch {
      setError("Không tải được danh sách đơn hàng. Kiểm tra lại phiên đăng nhập hoặc backend.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    setTitle("ĐƠN HÀNG ĐANG PHỤC VỤ");
    setDescription("Theo dõi món mới theo từng bàn, từng món, từng trạng thái phục vụ");
    void loadOrders();

    if (socket) {
      const handleUpdate = () => void loadOrders(true);

      const handleBillRequest = (data: { tableCode: string; displayName: string }) => {
        setBillRequests(prev => {
          const next = new Set(prev);
          next.add(data.tableCode);
          return next;
        });
      };

      socket.on("new_order", handleUpdate);
      socket.on("order_updated", handleUpdate);
      socket.on("bill_requested", handleBillRequest);

      return () => {
        socket.off("new_order", handleUpdate);
        socket.off("order_updated", handleUpdate);
        socket.off("bill_requested", handleBillRequest);
      };
    }
  }, [setTitle, setDescription, socket]);

  async function markServed(orderId: number, itemId: number) {
    try {
      await apiFetch(`/admin/orders/${orderId}/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "served" })
      });
      toast.success("Đã cập nhật món", "Trạng thái món đã chuyển sang đã phục vụ.");
      await loadOrders(true);
    } catch (error) {
      toast.error("Không cập nhật được món", error instanceof Error ? error.message : undefined);
    }
  }

  async function markPaid(orderId: number, tableCode: string) {
    if (!confirm("Xác nhận đơn hàng này đã thanh toán?")) return;
    try {
      await apiFetch(`/admin/orders/${orderId}/pay`, { method: "PATCH" });
      toast.success("Thành công", "Đơn hàng đã được đánh dấu là đã thanh toán.");
      setBillRequests(prev => {
        const next = new Set(prev);
        next.delete(tableCode);
        return next;
      });
      await loadOrders();
    } catch (error) {
      toast.error("Lỗi", error instanceof Error ? error.message : "Không thể thanh toán đơn hàng");
    }
  }

  function printBill(order: OrderBoard[0]) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = order.items.map(i => `
      <tr>
        <td style="padding: 5px 0; font-size: 14px;">${i.quantity}x ${i.item_name}</td>
        <td style="text-align: right; font-size: 14px;">${(i.unitPrice * i.quantity).toLocaleString()}đ</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>In Hóa Đơn - Bàn ${order.tableCode}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; width: 300px; margin: 0 auto; color: #000; }
            h2 { text-align: center; text-transform: uppercase; margin-bottom: 5px; font-size: 20px; }
            p { text-align: center; margin: 0 0 20px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .total { border-top: 1px solid #000; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; border-top: 1px dashed #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h2>BIÊN LAI</h2>
          <p>Bàn: ${order.tableCode} - ${order.displayName}<br/>Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
          <table>
            ${itemsHtml}
          </table>
          <div class="total">
            <span>TỔNG CỘNG</span>
            <span>${order.total.toLocaleString()}đ</span>
          </div>
          <div class="footer">Cảm ơn quý khách!<br/>Website: postcardqr.com</div>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  const activeOrders = orders.filter((order) => {
    // Show if unpaid
    if (order.paymentStatus !== "paid") return true;
    // OR if paid but has items not yet served
    return order.items.some(item => item.status !== "served");
  });

  return (
    <>
      <section className={styles.summaryBar}>
        <div>
          <span>Tổng đơn</span>
          <strong>{activeOrders.length}</strong>
        </div>
        <div>
          <span>Đã phục vụ</span>
          <strong>{activeOrders.filter((order) => order.orderStatus === "served").length}</strong>
        </div>
        <div>
          <span>Đang chờ</span>
          <strong>{activeOrders.filter((order) => order.orderStatus !== "served").length}</strong>
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
        {!loading && !error && activeOrders.length === 0 ? (
          <div className={styles.emptyState}>
            Chưa có đơn nào cần xử lý. Khi khách gọi món, thẻ đơn sẽ xuất hiện ở đây.
          </div>
        ) : null}

        {!loading &&
          !error &&
          activeOrders.map((order) => (
            <article key={order.orderId} className={styles.card}>
              <div className={styles.header}>
                <div>
                  <p>Bàn {order.tableCode}</p>
                  <h3>{order.displayName}</h3>
                </div>
                <div className={styles.orderActions}>
                  <button
                    className={`${styles.printBtn} ${billRequests.has(order.tableCode) ? styles.highlightPrint : ""}`}
                    onClick={() => printBill(order)}
                  >
                    IN BILL
                  </button>
                  {order.paymentStatus === "pending" && (
                    <button
                      className={styles.payIconBtn}
                      onClick={() => markPaid(order.orderId, order.tableCode)}
                      title="Đánh dấu đã thanh toán"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
              {order.customerNote ? <small className={styles.note}>Ghi chú: {order.customerNote}</small> : null}
              <div className={styles.items}>
                {order.items.map((item) => {
                  const served = item.status === "served";
                  return (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemBody}>
                        <strong>
                          {item.quantity}x {item.item_name}
                        </strong>
                      </div>
                      <button
                        type="button"
                        className={styles.serveBtn}
                        onClick={() => markServed(order.orderId, item.id)}
                        disabled={served}
                        data-served={served}
                      >
                        {served ? "✓" : "LÊN MÓN"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className={styles.footerActions}>
                <div className={styles.totalRow}>
                  <span>Thành tiền</span>
                  <strong>{order.total.toLocaleString("vi-VN")}đ</strong>
                </div>
              </div>
            </article>
          ))}
      </section>
    </>
  );
}
