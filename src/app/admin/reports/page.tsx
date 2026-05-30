"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import { useAdmin } from "../../../components/admin-context";
import styles from "./reports.module.css";

type Overview = {
  stats: {
    totalTables: number;
    activeTables: number;
    todayRevenue: number;
    pendingOrders: number;
  };
  revenueChart: Array<{ label: string; value: number }>;
  orders: Array<{
    orderId: number;
    displayName: string;
    tableCode: string;
    total: number;
  }>;
};

type RangeKey = "today" | "7d" | "custom";

export default function ReportsPage() {
  const { setTitle, setDescription } = useAdmin();
  const toast = useToast();
  const [data, setData] = useState<Overview | null>(null);
  const [range, setRange] = useState<RangeKey>("today");

  useEffect(() => {
    setTitle("BÁO CÁO & THỐNG KÊ");
    setDescription("Doanh thu, phân bố đơn hàng và hiệu suất vận hành");

    apiFetch<Overview>("/admin/overview")
      .then(setData)
      .catch((error) =>
        toast.error("Không tải được báo cáo", error instanceof Error ? error.message : undefined)
      );
  }, [setTitle, setDescription]);

  const bars = useMemo(() => [24, 46, 82, 38, 64, 88, 34], []);

  function exportJson() {
    const blob = new Blob([JSON.stringify({ range, data }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `postcardqr-report-${range}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportCsv() {
    const rows = [
      ["label", "value"],
      ...(data?.revenueChart ?? []).map((item) => [item.label, String(item.value)])
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `postcardqr-report-${range}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className={styles.filters}>
        <button type="button" className={range === "today" ? styles.active : ""} onClick={() => setRange("today")}>
          Hôm nay
        </button>
        <button type="button" className={range === "7d" ? styles.active : ""} onClick={() => setRange("7d")}>
          7 ngày qua
        </button>
        <button type="button" className={range === "custom" ? styles.active : ""} onClick={() => setRange("custom")}>
          Tùy chỉnh
        </button>
        <button type="button" onClick={exportJson}>Export PDF</button>
        <button type="button" className={styles.dark} onClick={exportCsv}>
          Excel
        </button>
      </section>

      <section className={styles.kpis}>
        <article className={styles.kpi}>
          <span>Tổng doanh thu</span>
          <strong>{(data?.stats.todayRevenue ?? 0).toLocaleString("vi-VN")}đ</strong>
          <p>+12% so với hôm qua</p>
        </article>
        <article className={styles.kpi}>
          <span>Giá trị TB đơn</span>
          <strong>452.000đ</strong>
          <p>-3% so với kỳ trước</p>
        </article>
        <article className={styles.kpi}>
          <span>Tỷ lệ xoay bàn</span>
          <strong>4.2 lượt/ngày</strong>
          <p>Ổn định</p>
        </article>
        <article className={styles.kpi}>
          <span>Món bán chạy nhất</span>
          <strong>Phở Bò Kobe</strong>
          <p>142 phần đã bán</p>
        </article>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Doanh thu theo giờ</h3>
            <span>Đơn vị: Triệu VND</span>
          </div>
          <div className={styles.chart}>
            {bars.map((bar, index) => (
              <div key={index} className={styles.barWrap}>
                <div
                  className={index === 2 || index === 5 || index === 6 ? styles.barAccent : styles.bar}
                  style={{ height: `${bar * 2.4}px` }}
                />
                <span>{`${8 + index * 2}:00`}</span>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.sidePanel}>
          <h3>Doanh thu theo nhóm</h3>
          <div className={styles.group}>
            <div>
              <strong>Món chính</strong>
              <span>65%</span>
            </div>
            <div className={styles.track}><i style={{ width: "65%" }} /></div>
          </div>
          <div className={styles.group}>
            <div>
              <strong>Đồ uống</strong>
              <span>20%</span>
            </div>
            <div className={styles.track}><i style={{ width: "20%", background: "#647c89" }} /></div>
          </div>
          <div className={styles.group}>
            <div>
              <strong>Món khai vị</strong>
              <span>10%</span>
            </div>
            <div className={styles.track}><i style={{ width: "10%", background: "#8e3300" }} /></div>
          </div>
          <div className={styles.group}>
            <div>
              <strong>Tráng miệng</strong>
              <span>5%</span>
            </div>
            <div className={styles.track}><i style={{ width: "5%", background: "#efefef" }} /></div>
          </div>
        </article>
      </section>
    </>
  );
}
