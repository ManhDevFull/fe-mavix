"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import { useAdmin } from "../../../components/admin-context";
import styles from "./tables.module.css";

type TableRow = {
  id: number;
  tableCode: string;
  displayName: string;
  seats: number;
  status: string;
};

export default function TablesPage() {
  const { setTitle, setDescription, slug } = useAdmin();
  const toast = useToast();
  const [tables, setTables] = useState<TableRow[]>([]);
  const [tableCode, setTableCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [seats, setSeats] = useState(4);
  const [selectedTable, setSelectedTable] = useState<TableRow | null>(null);

  async function loadTables() {
    setTables(await apiFetch<TableRow[]>("/admin/tables"));
  }

  useEffect(() => {
    setTitle("SƠ ĐỒ BÀN");
    setDescription("Quản lý sơ đồ bàn và sức chứa từng khu vực");
    loadTables().catch((error) =>
      toast.error("Không tải được sơ đồ bàn", error instanceof Error ? error.message : undefined)
    );
  }, [setTitle, setDescription]);

  async function createTable(event: FormEvent) {
    event.preventDefault();
    try {
      await apiFetch("/admin/tables", {
        method: "POST",
        body: JSON.stringify({ tableCode, displayName, seats })
      });
      setTableCode("");
      setDisplayName("");
      setSeats(4);
      toast.success("Đã tạo bàn mới", `${displayName || tableCode} đã được thêm vào sơ đồ bàn.`);
      await loadTables();
    } catch (error) {
      toast.error("Không tạo được bàn", error instanceof Error ? error.message : undefined);
    }
  }

  const getQrUrl = (tCode: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/${slug}/${tCode}`;
  };

  const qrImageUrl = (tCode: string) => {
    const url = getQrUrl(tCode);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  };

  return (
    <>
      <section className={styles.layout}>
        <form className={styles.createPanel} onSubmit={createTable}>
          <h3>Tạo bàn mới</h3>
          <input
            placeholder="Mã bàn (VD: B01)"
            value={tableCode}
            onChange={(event) => setTableCode(event.target.value)}
          />
          <input
            placeholder="Tên hiển thị (VD: Bàn số 1)"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <label className={styles.inputGroup}>
            <span>Số lượng chỗ ngồi</span>
            <input
              type="number"
              min={1}
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
            />
          </label>
          <button type="submit">+ Thêm bàn</button>
        </form>

        <div className={styles.board}>
          <div className={styles.toolbar}>
            <h3>Danh sách bàn đang quản lý</h3>
            <div className={styles.summary}>
              <span>{tables.length} bàn</span>
              <span>{tables.filter((table) => table.status !== "available").length} hoạt động</span>
            </div>
          </div>
          <div className={styles.grid}>
            {tables.map((table) => (
              <article key={table.id} className={styles.tableCard} onClick={() => setSelectedTable(table)}>
                <div className={styles.tableHead}>
                  <strong>{table.displayName}</strong>
                  <span>{table.status === "available" ? "Trống" : "Đang dùng"}</span>
                </div>
                <p>Mã: {table.tableCode}</p>
                <div className={styles.seats}>{table.seats} chỗ ngồi</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedTable && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTable(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>QR CODE BÀN</h2>
            <p>{selectedTable.displayName} ({selectedTable.tableCode})</p>

            <div className={styles.qrBox}>
              <img src={qrImageUrl(selectedTable.tableCode)} alt="Table QR Code" />
              <div className={styles.qrUrl}>{getQrUrl(selectedTable.tableCode)}</div>
            </div>

            <button type="button" className={styles.printButton} onClick={() => window.print()}>
              IN MÃ QR
            </button>
            <button type="button" className={styles.closeButton} onClick={() => setSelectedTable(null)}>
              ĐÓNG
            </button>
          </div>
        </div>
      )}
    </>
  );
}
