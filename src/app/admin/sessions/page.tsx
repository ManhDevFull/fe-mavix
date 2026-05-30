"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import { useAdmin } from "../../../components/admin-context";
import styles from "./sessions.module.css";

type SessionRow = {
  id: string;
  device_name: string | null;
  ip_address: string | null;
  last_used_at: string;
  revoked_at: string | null;
};

export default function SessionsPage() {
  const { setTitle, setDescription } = useAdmin();
  const toast = useToast();
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState("");

  async function load() {
    try {
      const data = await apiFetch<{ currentSessionId: string; sessions: SessionRow[] }>("/auth/sessions");
      setRows(data.sessions);
      setCurrentSessionId(data.currentSessionId);
    } catch (error) {
      toast.error("Không tải được phiên đăng nhập", error instanceof Error ? error.message : undefined);
    }
  }

  useEffect(() => {
    setTitle("PHIÊN ĐĂNG NHẬP");
    setDescription("Theo dõi thiết bị đang truy cập và quản lý bảo mật tài khoản");
    void load();
  }, [setTitle, setDescription]);

  async function revokeSession(id: string) {
    try {
      await apiFetch(`/admin/sessions/${id}`, { method: "DELETE" });
      toast.success("Đã thu hồi phiên", "Phiên đăng nhập đã bị vô hiệu hóa.");
      await load();
    } catch (error) {
      toast.error("Không thu hồi được phiên", error instanceof Error ? error.message : undefined);
    }
  }

  async function revokeOthers() {
    try {
      await apiFetch("/auth/sessions/others", { method: "DELETE" });
      toast.success("Đã đăng xuất các phiên khác", "Chỉ giữ lại phiên hiện tại.");
      await load();
    } catch (error) {
      toast.error("Không đăng xuất được các phiên khác", error instanceof Error ? error.message : undefined);
    }
  }

  return (
    <>
      <section className={styles.headerRow}>
        <article className={styles.stat}>
          <span>Phiên đang mở</span>
          <strong>{rows.length}</strong>
        </article>
        <article className={styles.stat}>
          <span>Thiết bị hoạt động</span>
          <strong>{rows.filter((row) => !row.revoked_at).length}</strong>
        </article>
        <button type="button" className={styles.revokeAll} onClick={() => revokeOthers()}>
          Đăng xuất các phiên khác
        </button>
      </section>

      <section className={styles.panel}>
        <div className={styles.head}>
          <h3>Danh sách phiên</h3>
          <span>Current session highlighted</span>
        </div>

        <div className={styles.tableHead}>
          <span>Thiết bị</span>
          <span>IP</span>
          <span>Hoạt động cuối</span>
          <span>Trạng thái</span>
          <span>Thao tác</span>
        </div>

        {rows.map((row) => (
          <div key={row.id} className={styles.row}>
            <strong>{row.device_name ?? "Browser session"}</strong>
            <span>{row.ip_address ?? "n/a"}</span>
            <span>{new Date(row.last_used_at).toLocaleString("vi-VN")}</span>
            <span className={row.id === currentSessionId ? styles.current : styles.normal}>
              {row.id === currentSessionId ? "Đang dùng" : "Đang hoạt động"}
            </span>
            <button
              type="button"
              disabled={row.id === currentSessionId}
              onClick={() => revokeSession(row.id)}
            >
              {row.id === currentSessionId ? "Hiện tại" : "Đăng xuất"}
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
