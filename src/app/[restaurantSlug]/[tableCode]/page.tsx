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
  };
  table: {
    code: string;
    displayName: string;
    status: string;
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

export default function PublicMenuPage() {
  const params = useParams<{ restaurantSlug: string; tableCode: string }>();
  const restaurantSlug = params?.restaurantSlug ?? "";
  const tableCode = params?.tableCode ?? "";
  const [data, setData] = useState<MenuResponse | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [customerNote, setCustomerNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!restaurantSlug || !tableCode) {
      return;
    }

    fetch(
      `${API_URL}/public/restaurants/${restaurantSlug}/tables/${tableCode}/menu`,
      { cache: "no-store" }
    )
      .then((response) => response.json())
      .then(setData)
      .catch(console.error);
  }, [restaurantSlug, tableCode]);


  const total = useMemo(
    () =>
      (data?.items ?? []).reduce(
        (sum, item) => sum + item.price * (cart[item.id] ?? 0),
        0
      ),
    [cart, data]
  );

  async function placeOrder() {
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ customerNote, items })
      }
    );

    if (!response.ok) {
      setMessage("Order failed");
      return;
    }

    const result = await response.json();
    setMessage(
      `Order #${result.id} created. Transfer to ${result.payment.bankName} ${result.payment.accountNumber} with content ${result.payment.transferContent}`
    );
    setCart({});
    setCustomerNote("");
  }

  if (!data) {
    return <div className={styles.loading}>Đang tải thực đơn...</div>;
  }

  if (!(data as any).restaurant) {
    return (
      <div className={styles.errorPage}>
        <h1>Không tìm thấy dữ liệu</h1>
        <p>Bàn hoặc nhà hàng không tồn tại. Vui lòng kiểm tra lại mã QR.</p>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{data.restaurant.name}</p>
        <h1>{data.table.displayName}</h1>
        <p>{data.restaurant.address}</p>
      </section>
      <section className={styles.layout}>
        <div className={styles.menu}>
          <article className={styles.panel}>
            <h2>Thực đơn</h2>
            <div className={styles.items}>
              {(data?.items ?? []).map((item) => (
                <div key={item.id} className={styles.item}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                    <span>{item.price.toLocaleString("vi-VN")} VND</span>
                  </div>
                  <div className={styles.counter}>
                    <button
                      onClick={() =>
                        setCart((current) => ({
                          ...current,
                          [item.id]: Math.max((current[item.id] ?? 0) - 1, 0)
                        }))
                      }
                    >
                      -
                    </button>
                    <span>{cart[item.id] ?? 0}</span>
                    <button
                      onClick={() =>
                        setCart((current) => ({
                          ...current,
                          [item.id]: (current[item.id] ?? 0) + 1
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              {(!data?.items || data.items.length === 0) && (
                <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Chưa có món ăn nào.</p>
              )}
            </div>
          </article>
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.panel}>
            <h2>Chi tiết đơn hàng</h2>
            <p>Tổng cộng</p>
            <strong>{total.toLocaleString("vi-VN")} VND</strong>
            <textarea
              placeholder="Ghi chú cho bếp"
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
            />
            <button onClick={placeOrder} disabled={total === 0}>
              Đặt món ngay
            </button>
            {message ? <small className={styles.orderMessage}>{message}</small> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
