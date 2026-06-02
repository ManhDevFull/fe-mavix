"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/admin-shell";
import { apiFetch } from "../../lib/api";
import { useToast } from "../../components/toast-provider";
import styles from "./admin.module.css";
import { useAdmin } from "../../components/admin-context";

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

export default function AdminPage() {
  const { setTitle, setDescription, socket } = useAdmin();
  const toast = useToast();
  const [data, setData] = useState<DashboardData | null>(null);

  const loadData = (silent = false) => {
    apiFetch<DashboardData>("/admin/overview").then(setData).catch((error) => {
      if (!silent) toast.error("Không tải được tổng quan", error instanceof Error ? error.message : undefined);
    });
  };

  useEffect(() => {
    setTitle("HỆ THỐNG TỔNG QUAN");
    setDescription("Bảng điều khiển vận hành thời gian thực cho nhà hàng");

    loadData();

    if (socket) {
      const handleUpdate = () => loadData(true);
      socket.on("new_order", handleUpdate);
      socket.on("order_updated", handleUpdate);
      return () => {
        socket.off("new_order", handleUpdate);
        socket.off("order_updated", handleUpdate);
      };
    }

    const interval = setInterval(() => loadData(true), 30000);
    return () => clearInterval(interval);
  }, [setTitle, setDescription, socket]);

  const revenueBars = useMemo(() => {
    if (!data?.hourlyRevenue || data.hourlyRevenue.length === 0) {
      return new Array(12).fill(0).map((_, i) => ({ label: "--", value: 0 }));
    }

    return data.hourlyRevenue.map(item => ({
      label: `${item.hour.toString().padStart(2, '0')}:00`,
      value: item.total
    }));
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
            {(!data?.hourlyRevenue || data.hourlyRevenue.every(b => b.total === 0)) && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#666', fontSize: '0.9rem', fontWeight: 700 }}>
                Chưa có dữ liệu 12h qua
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
