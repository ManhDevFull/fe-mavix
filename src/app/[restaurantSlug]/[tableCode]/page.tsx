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

  const grouped = useMemo(() => {
    const map = new Map<string, MenuResponse["items"]>();
    for (const item of data?.items ?? []) {
      const current = map.get(item.category) ?? [];
      current.push(item);
      map.set(item.category, current);
    }
    return Array.from(map.entries());
  }, [data]);

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

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{data?.restaurant.name ?? "Loading..."}</p>
        <h1>{data?.table.displayName ?? "Table"}</h1>
        <p>{data?.restaurant.address}</p>
      </section>
      <section className={styles.layout}>
        <div className={styles.menu}>
          {grouped.map(([category, items]) => (
            <article key={category} className={styles.panel}>
              <h2>{category}</h2>
              <div className={styles.items}>
                {items.map((item) => (
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
              </div>
            </article>
          ))}
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.panel}>
            <h2>Order summary</h2>
            <p>Total</p>
            <strong>{total.toLocaleString("vi-VN")} VND</strong>
            <textarea
              placeholder="Kitchen note"
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
            />
            <button onClick={placeOrder}>Place order</button>
            {message ? <small>{message}</small> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
