"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "../../../lib/api";
import styles from "./public-menu.module.css";

type MenuResponse = {
  restaurant: {
    slug: string;
    name: string;
    address: string | null;
    phone: string | null;
    plan: string;
    qrBankName: string | null;
    qrBankAccountName: string | null;
    qrBankAccountNumber: string | null;
    qrPaymentPrefix: string | null;
    paymentMode: "prepaid" | "postpaid" | "both";
  };
  table: {
    code: string;
    displayName: string;
    status: "available" | "occupied";
  };
  items: Array<{
    id: number;
    category: string;
    name: string;
    description: string | null;
    price: number;
    isAvailable: boolean;
  }>;
};

type BillData = {
  restaurant: MenuResponse["restaurant"];
  table: MenuResponse["table"];
  orders: Array<{ id: number; status: string; total: number; createdAt: string }>;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  transferContent: string;
};

export default function PublicMenuPage() {
  const params = useParams<{ restaurantSlug: string; tableCode: string }>();
  const restaurantSlug = params?.restaurantSlug ?? "";
  const tableCode = params?.tableCode ?? "";

  const [data, setData] = useState<MenuResponse | null>(null);
  const [bill, setBill] = useState<BillData | null>(null);
  const [view, setView] = useState<"menu" | "bill">("menu");

  const [cart, setCart] = useState<Record<number, number>>({});
  const [customerNote, setCustomerNote] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "paying" | "success">("idle");
  const [message, setMessage] = useState("");
  const [billRequested, setBillRequested] = useState(false);
  const [sessionConfirmed, setSessionConfirmed] = useState(false);

  const loadMenu = async () => {
    try {
      const resp = await fetch(`${API_URL}/public/restaurants/${restaurantSlug}/tables/${tableCode}/menu`, { cache: "no-store" });
      const json = await resp.json();
      setData(json);
      if (json.table.status === "occupied" && json.restaurant.paymentMode !== "prepaid") {
        loadBill();
        setView("bill");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadBill = async () => {
    try {
      const resp = await fetch(`${API_URL}/public/restaurants/${restaurantSlug}/tables/${tableCode}/bill`, { cache: "no-store" });
      const json = await resp.json();
      setBill(json);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (restaurantSlug && tableCode) {
      loadMenu();
    }
  }, [restaurantSlug, tableCode]);

  const total = useMemo(
    () => (data?.items ?? []).reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0),
    [cart, data]
  );

  async function handleOrder() {
    if (total === 0) return;

    const mode = data?.restaurant.paymentMode;

    if (mode === "prepaid") {
      setCheckoutStep("paying");
      // Simulate payment delay
      setTimeout(async () => {
        await placeOrder("paid");
        setCheckoutStep("success");
      }, 3000);
    } else {
      await placeOrder("pending");
      loadMenu(); // Refresh to see if table is occupied
    }
  }

  async function placeOrder(status: "pending" | "paid") {
    const items = Object.entries(cart)
      .filter(([, quantity]) => quantity > 0)
      .map(([menuItemId, quantity]) => ({
        menuItemId: Number(menuItemId),
        quantity
      }));

    const response = await fetch(
      `${API_URL}/public/restaurants/${restaurantSlug}/tables/${tableCode}/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerNote, items, status })
      }
    );

    if (response.ok) {
      setCart({});
      setCustomerNote("");
      if (status === "paid") {
        setMessage("Đơn hàng đã thanh toán và đang được chuẩn bị!");
      } else {
        setMessage("Đặt món thành công! Vui lòng chờ phục vụ.");
      }
    }
  }

  if (!data) return <div className={styles.loading}>Đang tải...</div>;

  if (data.table.status === "occupied" && !sessionConfirmed) {
    return (
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{data.restaurant.name}</p>
          <h1>{data.table.displayName}</h1>
        </header>

        <section style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          minHeight: '40vh'
        }}>
          <article className={styles.panel} style={{
            maxWidth: '460px',
            width: '100%',
            textAlign: 'center',
            padding: '40px 30px',
            margin: '0 auto'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: 900 }}>BÀN ĐANG SỬ DỤNG</h2>
            <p style={{ margin: '15px 0 30px', color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Chào mừng bạn đến với <b>{data.restaurant.name}</b>!<br />
              Bàn này hiện đang có một phiên hoạt động. Vui lòng xác nhận trạng thái của bạn:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                className={styles.orderButton}
                onClick={() => setSessionConfirmed(true)}
              >
                TÔI DÙNG TIẾP BÀN NÀY
              </button>
              <button
                className={styles.secondaryButton}
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border)', fontWeight: 900 }}
                onClick={async () => {
                  await fetch(`${API_URL}/public/restaurants/${restaurantSlug}/tables/${tableCode}/reset-table`, { method: "POST" });
                  setSessionConfirmed(true);
                  loadMenu();
                }}
              >
                TÔI LÀ KHÁCH MỚI
              </button>
            </div>
          </article>
        </section>
      </main>
    );
  }

  if (checkoutStep === "paying") {
    return (
      <div className={styles.payModal}>
        <div className={styles.payCard}>
          <div className={styles.successState}>
            <div className={styles.qrContainer}>
              <img
                src={`https://img.vietqr.io/image/${data.restaurant.qrBankName?.split(' ')[0]}-${data.restaurant.qrBankAccountNumber}-compact.png?amount=${total}&addInfo=${data.restaurant.qrPaymentPrefix ?? data.restaurant.slug}_${tableCode}_PRE`}
                alt="QR Payment"
                style={{ width: "100%" }}
              />
            </div>
            <strong>ĐANG XỬ LÝ THANH TOÁN (DEMO 3S)</strong>
            <p>Vui lòng không đóng trình duyệt...</p>
            <div className={styles.skeleton}></div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "bill" && bill) {
    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>{bill.restaurant.name}</p>
          <h1>{bill.table.displayName}</h1>
          <div className={styles.successBadge}>BÀN ĐANG SỬ DỤNG</div>
        </section>

        <section className={styles.layout}>
          <div className={styles.menu}>
            <article className={styles.panel}>
              <div className={styles.panelHead}>
                <h2>Chi tiết hóa đơn</h2>
                <button className={styles.secondaryButton} onClick={() => setView("menu")}>+ Gọi thêm món</button>
              </div>
              <div className={styles.billItems}>
                {bill.items.map((item, i) => (
                  <div key={i} className={styles.billItem}>
                    <span>{item.quantity}x {item.name}</span>
                    <b>{(item.price * item.quantity).toLocaleString()}đ</b>
                  </div>
                ))}
              </div>
              <div className={styles.billTotal}>
                <span>Tổng tiền:</span>
                <h1>{bill.total.toLocaleString()}đ</h1>
              </div>
            </article>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.panel}>
              <h2>{bill.restaurant.paymentMode === 'prepaid' ? 'Biên lai' : 'Thanh toán'}</h2>
              <div className={styles.payOptions}>
                {bill.restaurant.paymentMode !== 'prepaid' && (
                  <>
                    <div className={styles.qrSection}>
                      <p>Tự thanh toán qua QR</p>
                      <img
                        src={`https://img.vietqr.io/image/${bill.restaurant.qrBankName?.split(' ')[0]}-${bill.restaurant.qrBankAccountNumber}-compact.png?amount=${bill.total}&addInfo=${bill.transferContent}`}
                        alt="QR"
                        className={styles.miniQr}
                      />
                      <small>Nội dung: {bill.transferContent}</small>
                    </div>
                    <div className={styles.divider}>HOẶC</div>
                  </>
                )}

                {billRequested ? (
                  <div className={styles.successBadge} style={{ width: '100%', textAlign: 'center', padding: '12px', marginBottom: '10px' }}>
                    ĐÃ GỬI YÊU CẦU
                  </div>
                ) : (
                  <button className={styles.orderButton} onClick={async () => {
                    try {
                      await fetch(`${API_URL}/public/restaurants/${restaurantSlug}/tables/${tableCode}/request-bill`, { method: "POST" });
                      setBillRequested(true);
                    } catch (e) {
                      alert("Không thể gửi yêu cầu, vui lòng báo nhân viên trực tiếp.");
                    }
                  }}>
                    {bill.restaurant.paymentMode === 'prepaid' ? 'YÊU CẦU IN HÓA ĐƠN' : 'GỌI NHÂN VIÊN IN BILL'}
                  </button>
                )}

                {bill.restaurant.paymentMode !== 'prepaid' && (
                  <p className={styles.hintText}>Bạn có thể thanh toán tiền mặt sau khi nhận bill</p>
                )}
                {bill.restaurant.paymentMode === 'prepaid' && (
                  <p className={styles.hintText} style={{ color: '#1dbb87' }}>✅ Đơn hàng của bạn đã được thanh toán.</p>
                )}
              </div>
            </div>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p className={styles.eyebrow}>{data.restaurant.name}</p>
            <h1>{data.table.displayName}</h1>
          </div>
          {data.table.status === 'occupied' && (
            <button
              className={styles.orderButton}
              style={{ width: 'auto', padding: '10px 20px', fontSize: '0.8rem' }}
              onClick={() => { loadBill(); setView("bill"); }}
            >
              HÓA ĐƠN / GỌI BILL
            </button>
          )}
        </div>
      </header>

      <section className={styles.layout}>
        <div className={styles.menu}>
          <article className={styles.panel}>
            <h2>Thực đơn</h2>
            <div className={styles.items}>
              {data.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                    <span>{item.price.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className={styles.counter}>
                    <button onClick={() => setCart(c => ({ ...c, [item.id]: Math.max((c[item.id] ?? 0) - 1, 0) }))}>-</button>
                    <span>{cart[item.id] ?? 0}</span>
                    <button onClick={() => setCart(c => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }))}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.panel}>
            <h2>{data.restaurant.paymentMode === 'prepaid' ? 'Thanh toán' : 'Đơn hàng'}</h2>
            {message && !total ? (
              <div className={styles.orderMessage}>
                <div className={styles.successBadge}>THÀNH CÔNG</div>
                <p className={styles.successText}>{message}</p>
                <button className={styles.secondaryButton} onClick={() => setMessage("")}>Tiếp tục gọi món</button>
              </div>
            ) : (
              <>
                <p>Tổng cộng</p>
                <strong>{total.toLocaleString()}đ</strong>
                <textarea
                  placeholder="Ghi chú (ví dụ: Không hành...)"
                  value={customerNote}
                  onChange={e => setCustomerNote(e.target.value)}
                />
                <button className={styles.orderButton} onClick={handleOrder} disabled={total === 0}>
                  {data.restaurant.paymentMode === 'prepaid' ? 'THANH TOÁN & ĐẶT MÓN' : 'XÁC NHẬN ĐẶT MÓN'}
                </button>
              </>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
