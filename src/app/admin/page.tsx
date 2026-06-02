"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin-shell";
import { apiFetch } from "../../lib/api";
import { useToast } from "../../components/toast-provider";
import styles from "./admin.module.css";

type DashboardData = {
  stats: {
    totalTables: number;
    activeTables: number;
    todayRevenue: number;
    pendingOrders: number;
  };
  hourlyRevenue: { hour: number; total: number }[];
  orders: {
    orderId: number;
    displayName: string;
    items: { id: number; itemName: string; quantity: number; status: string }[];
  }[];
};

import { useAdmin } from "../../components/admin-context";

export default function AdminPage() {
  const { setTitle, setDescription } = useAdmin();
  const toast = useToast();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    setTitle("HỆ THỐNG TỔNG QUAN");
    setDescription("Bảng điều khiển vận hành thời gian thực cho nhà hàng");

    apiFetch<DashboardData>("/admin/overview").then(setData).catch((error) => {
      toast.error("Không tải được tổng quan", error instanceof Error ? error.message : undefined);
    });

    const interval = setInterval(() => {
      apiFetch<DashboardData>("/admin/overview").then(setData).catch(() => undefined);
    }, 10000);
    return () => clearInterval(interval);
  }, [setTitle, setDescription]);

  const revenueBars = useMemo(() => {
    const bars = new Array(12).fill(0).map((_, i) => ({ label: `${(8 + i * 1).toString().padStart(2, '0')}:00`, value: 0 }));
    if (!data?.hourlyRevenue) return bars;

    data.hourlyRevenue.forEach(item => {
      const index = item.hour - 8;
      if (index >= 0 && index < 12) {
        bars[index].value = item.total;
      }
    });
    return bars;
  }, [data]);

  const topOrders = (data?.orders ?? []).slice(0, 5);

  return (
    <>
      <section className={styles.stats}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <span>Doanh thu hôm nay</span>
          </div>
          <strong>{(data?.stats.todayRevenue ?? 0).toLocaleString("vi-VN")}đ</strong>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTop}>
            <span>Bàn đang hoạt động</span>
            <span className={styles.inlineStat}>
              {data?.stats.activeTables ?? 0} / {data?.stats.totalTables} BÀN
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{
                width: `${((data?.stats.activeTables ?? 0) / (data?.stats.totalTables || 1)) * 100}%`
              }}
            />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTop}>
            <span>Đơn hàng đang chờ</span>
            {(data?.stats.pendingOrders ?? 0) > 0 && (
              <span className={styles.urgent}>URGENT</span>
            )}
          </div>
          <strong>
            {(data?.stats.pendingOrders ?? 0) < 10
              ? `0${data?.stats.pendingOrders ?? 0}`
              : data?.stats.pendingOrders ?? 0}
          </strong>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Biểu đồ doanh thu theo giờ</h3>
            <span className={styles.legend}>
              <i /> Thực tế
            </span>
          </div>
          <div className={styles.chart}>
            {revenueBars.map((bar, i) => (
              <div key={i} className={styles.barWrap}>
                <div className={styles.bar} style={{ height: `${Math.min(150, (bar.value / 100000) * 15)}px` }} />
                <span>{bar.label}</span>
              </div>
            ))}
            {data?.hourlyRevenue?.length === 0 && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#666' }}>
                Chưa có dữ liệu hôm nay
              </div>
            )}
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.feedHeader}>
            <h3>Bảng tin hoạt động</h3>
            <span className={styles.liveTag}>LIVE</span>
          </div>
          <div className={styles.cards}>
            {topOrders.map((order) => (
              <div key={order.orderId} className={styles.orderCard}>
                <strong>Đơn hàng mới #{order.orderId}</strong>
                <ul>
                  <li>{order.displayName} • {order.items.length} món</li>
                  <li className={styles.inlineButtons}>
                    <button type="button" className={styles.primaryMini}>
                      Xử lý
                    </button>
                    <button type="button" className={styles.ghostMini}>
                      Chi tiết
                    </button>
                  </li>
                </ul>
              </div>
            ))}
            {(!data?.orders || data.orders.length === 0) && (
              <div className={styles.emptyState}>
                Chưa có đơn hàng mới
              </div>
            )}
            <button type="button" className={styles.fullWidthButton}>
              Xem tất cả hoạt động
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
