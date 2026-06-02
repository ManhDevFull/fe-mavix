"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import { useAdmin } from "../../../components/admin-context";
import styles from "./reports.module.css";

type ReportsData = {
  dailyRevenue: Array<{ date: string; total: number; count: number }>;
  topItems: Array<{ name: string; totalQuantity: number }>;
};

export default function ReportsPage() {
  const { setTitle, setDescription } = useAdmin();
  const toast = useToast();
  const [data, setData] = useState<ReportsData | null>(null);
  const [range, setRange] = useState<RangeKey>("7d");

  useEffect(() => {
    setTitle("BÁO CÁO & THỐNG KÊ");
    setDescription("Doanh thu, mặt hàng bán chạy và hiệu suất vận hành");

    apiFetch<ReportsData>("/admin/reports")
      .then(setData)
      .catch((error) =>
        toast.error("Không tải được báo cáo", error instanceof Error ? error.message : undefined)
      );
  }, [setTitle, setDescription]);

  const kpis = useMemo(() => {
    if (!data) return [];
    const totalRevenue = data.dailyRevenue.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = data.dailyRevenue.reduce((acc, curr) => acc + curr.count, 0);
    const topItem = data.topItems[0]?.name || "Chưa có dữ liệu";
    const topItemQty = data.topItems[0]?.totalQuantity || 0;

    return [
      { label: "Tổng doanh thu", value: `${totalRevenue.toLocaleString("vi-VN")}đ`, note: "30 ngày qua" },
      { label: "Tổng đơn hàng", value: totalOrders, note: "30 ngày qua" },
      { label: "Giá trị TB đơn", value: `${totalOrders ? (totalRevenue / totalOrders).toLocaleString("vi-VN") : 0}đ`, note: "Tính ổn định cao" },
      { label: "Món chạy nhất", value: topItem, note: `${topItemQty} phần đã bán` }
    ];
  }, [data]);

  const dailyBars = useMemo(() => {
    if (!data) return [];
    // Last 7 days
    return data.dailyRevenue.slice(-7);
  }, [data]);

  return (
    <>
      <section className={styles.filters}>
        <button type="button" className={styles.active}>30 ngày qua</button>
        <button type="button" onClick={() => toast.success("Đang chuẩn bị dữ liệu PDF...")}>Export PDF</button>
        <button type="button" className={styles.dark} onClick={() => toast.success("Đang xuất file Excel...")}>Excel</button>
      </section>

      <section className={styles.kpis}>
        {kpis.map((kpi, idx) => (
          <article key={idx} className={styles.kpi}>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <p>{kpi.note}</p>
          </article>
        ))}
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Doanh thu theo ngày</h3>
            <span>7 ngày gần nhất</span>
          </div>
          <div className={styles.chart}>
            {dailyBars.map((bar, index) => (
              <div key={index} className={styles.barWrap}>
                <div
                  className={index === dailyBars.length - 1 ? styles.barAccent : styles.bar}
                  style={{ height: `${Math.min(200, (bar.total / 100000) * 10)}px` }}
                />
                <span style={{ fontSize: '10px' }}>{new Date(bar.date).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}</span>
              </div>
            ))}
            {dailyBars.length === 0 && <p style={{ margin: 'auto', color: '#666' }}>Chưa có dữ liệu giao dịch</p>}
          </div>
        </article>

        <article className={styles.sidePanel}>
          <h3>Top 5 món bán chạy</h3>
          <div style={{ padding: '0 10px' }}>
            {data?.topItems.map((item, idx) => (
              <div key={idx} className={styles.group} style={{ marginBottom: '15px' }}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.totalQuantity} phần</span>
                </div>
                <div className={styles.track}>
                  <i style={{
                    width: `${(item.totalQuantity / (data.topItems[0].totalQuantity || 1)) * 100}%`,
                    background: idx === 0 ? "#0f2d89" : "#647c89"
                  }} />
                </div>
              </div>
            ))}
            {(!data || data.topItems.length === 0) && <p style={{ color: '#666' }}>Chưa có món ăn nào được bán</p>}
          </div>
        </article>
      </section>
    </>
  );
}
