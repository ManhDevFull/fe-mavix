"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import { useAdmin } from "../../../components/admin-context";
import styles from "./devices.module.css";

type Device = {
  id: number;
  deviceCode: string;
  deviceName: string;
  deviceType: string;
  status: string;
  batteryPercent: number;
  tableCode: string | null;
  lastSeenAt: string | null;
};

type Table = {
  id: number;
  tableCode: string;
  displayName: string;
};

export default function DevicesPage() {
  const { setTitle, setDescription, plan } = useAdmin();
  const toast = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  const isLocked = !["pro", "premium", "edition"].includes(plan?.toLowerCase() || "");

  const [filter, setFilter] = useState<"all" | "online" | "offline">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    deviceCode: "",
    deviceName: "",
    deviceType: "esp32_display",
    tableId: 0,
    batteryPercent: 100
  });

  async function load() {
    if (isLocked) return;
    const [deviceRows, tableRows] = await Promise.all([
      apiFetch<Device[]>("/admin/devices"),
      apiFetch<Table[]>("/admin/tables")
    ]);
    setDevices(deviceRows);
    setTables(tableRows);
    if (!form.tableId && tableRows[0]) {
      setForm((current) => ({ ...current, tableId: tableRows[0].id }));
    }
  }

  useEffect(() => {
    setTitle("QUẢN LÝ THIẾT BỊ IoT");
    setDescription("Thiết bị ESP32, trạng thái tín hiệu và quản trị firmware");
    if (!isLocked) {
      load().catch((error) =>
        toast.error("Không tải được thiết bị", error instanceof Error ? error.message : undefined)
      );
    }
  }, [setTitle, setDescription, isLocked]);

  if (isLocked) {
    return (
      <div className={styles.lockedContainer}>
        <div className={styles.lockedContent}>
          <div className={styles.lockIcon}>⚡</div>
          <h2>TÍNH NĂNG IOT CHUYÊN NGHIỆP</h2>
          <p>Quản lý thiết bị ESP32, Gateway và Printer chỉ dành cho gói <strong>PRO</strong> trở lên.</p>
          <ul className={styles.lockFeatures}>
            <li>✓ Đồng bộ trạng thái Real-time (MQTT)</li>
            <li>✓ Quản lý pin và tín hiệu thiết bị</li>
            <li>✓ Cập nhật Firmware OTA từ xa</li>
            <li>✓ Live System Logs</li>
          </ul>
          <button
            type="button"
            className={styles.upgradeBtn}
            onClick={() => window.location.href = "/admin/settings?tab=subscription"}
          >
            NÂNG CẤP GÓI NGAY
          </button>
        </div>
      </div>
    );
  }

  async function createDevice(event: FormEvent) {
    event.preventDefault();
    try {
      await apiFetch("/admin/devices", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          tableId: form.tableId || null
        })
      });
      toast.success("Đã thêm thiết bị", form.deviceName);
      setShowForm(false);
      setForm({
        deviceCode: "",
        deviceName: "",
        deviceType: "esp32_display",
        tableId: tables[0]?.id ?? 0,
        batteryPercent: 100
      });
      await load();
    } catch (error) {
      toast.error("Không thêm được thiết bị", error instanceof Error ? error.message : undefined);
    }
  }

  async function setStatus(id: number, status: string) {
    try {
      await apiFetch(`/admin/devices/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      toast.success("Đã cập nhật thiết bị", `Thiết bị đã chuyển sang trạng thái ${status}.`);
      await load();
    } catch (error) {
      toast.error("Không cập nhật được thiết bị", error instanceof Error ? error.message : undefined);
    }
  }

  async function remove(id: number) {
    try {
      const current = devices.find((device) => device.id === id);
      await apiFetch(`/admin/devices/${id}`, { method: "DELETE" });
      toast.success("Đã xóa thiết bị", current?.deviceName);
      await load();
    } catch (error) {
      toast.error("Không xóa được thiết bị", error instanceof Error ? error.message : undefined);
    }
  }

  const visibleDevices = useMemo(() => {
    if (filter === "all") {
      return devices;
    }
    return devices.filter((device) => device.status === filter);
  }, [devices, filter]);

  return (
    <>
      <section className={styles.topStats}>
        <article className={styles.stat}>
          <span>Thiết bị trực tuyến</span>
          <strong>
            {devices.filter((device) => device.status === "online").length} / {devices.length}
          </strong>
        </article>
        <article className={styles.signal}>
          <div className={styles.signalHead}>
            <span>Độ ổn định tín hiệu (24h)</span>
            <strong>98.4%</strong>
          </div>
          <div className={styles.signalBars}>
            {Array.from({ length: 12 }).map((_, index) => (
              <i key={index} style={{ opacity: 0.3 + index * 0.05 }} />
            ))}
          </div>
        </article>
      </section>

      <section className={styles.tablePanel}>
        <div className={styles.tableHead}>
          <h3>Danh sách thiết bị ESP32</h3>
          <div className={styles.actions}>
            <button type="button" onClick={() => setFilter("all")} className={filter === "all" ? styles.primary : ""}>
              Tất cả
            </button>
            <button type="button" onClick={() => setFilter("online")} className={filter === "online" ? styles.primary : ""}>
              Online
            </button>
            <button type="button" onClick={() => setFilter("offline")} className={filter === "offline" ? styles.primary : ""}>
              Offline
            </button>
            <button type="button" className={styles.primary} onClick={() => setShowForm((current) => !current)}>
              + Thêm thiết bị
            </button>
          </div>
        </div>

        {showForm ? (
          <form className={styles.createBox} onSubmit={createDevice}>
            <input
              placeholder="Serial number"
              value={form.deviceCode}
              onChange={(event) => setForm((current) => ({ ...current, deviceCode: event.target.value }))}
            />
            <input
              placeholder="Tên thiết bị"
              value={form.deviceName}
              onChange={(event) => setForm((current) => ({ ...current, deviceName: event.target.value }))}
            />
            <select
              value={form.tableId}
              onChange={(event) => setForm((current) => ({ ...current, tableId: Number(event.target.value) }))}
            >
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.displayName}
                </option>
              ))}
            </select>
            <select
              value={form.deviceType}
              onChange={(event) => setForm((current) => ({ ...current, deviceType: event.target.value }))}
            >
              <option value="esp32_display">ESP32 Display</option>
              <option value="esp32_gateway">ESP32 Gateway</option>
              <option value="esp32_printer">ESP32 Printer</option>
            </select>
            <label className={styles.formLabel}>
              <span>Pin thiết bị (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={form.batteryPercent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, batteryPercent: Number(event.target.value) }))
                }
              />
            </label>
            <button type="submit">Lưu thiết bị</button>
          </form>
        ) : null}

        <div className={styles.gridHead}>
          <span>Tên thiết bị</span>
          <span>Serial number</span>
          <span>Bàn gắn</span>
          <span>Trạng thái</span>
          <span>Pin</span>
          <span>Loại</span>
          <span>Thao tác</span>
        </div>

        {visibleDevices.map((device) => (
          <div key={device.id} className={styles.row}>
            <strong>{device.deviceName}</strong>
            <span>{device.deviceCode}</span>
            <span>{device.tableCode ?? "-"}</span>
            <span className={device.status === "online" ? styles.online : styles.offline}>
              {device.status}
            </span>
            <span className={styles.battery}>{device.batteryPercent}%</span>
            <span>{device.deviceType}</span>
            <div className={styles.rowActions}>
              <button type="button" onClick={() => setStatus(device.id, "online")}>
                <span>↻</span>
                <em>Ping</em>
              </button>
              <button type="button" onClick={() => setStatus(device.id, "offline")}>
                <span>◌</span>
                <em>Offline</em>
              </button>
              <button type="button" onClick={() => remove(device.id)}>
                <span>✕</span>
                <em>Xóa</em>
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.logs}>
          <div className={styles.logsHead}>SYSTEM LIVE LOGS</div>
          <pre>
            {`[14:22:01] Device B01 connected to SSID "MK_IoT_Main"
[14:22:05] Handshake successful with MQTT Broker
[14:23:44] ERROR: Device B02 connection timeout
[14:24:00] Firmware OTA check initiated for all nodes...
[14:25:00] System health check: 22 nodes healthy.`}
          </pre>
        </article>
        <aside className={styles.sideCards}>
          <div className={styles.firmware}>
            <strong>Cập nhật firmware</strong>
            <b>7 thiết bị</b>
            <p>Có bản cập nhật mới v2.4.2</p>
            <button type="button">Update all</button>
          </div>
          <div className={styles.scanCard}>
            <button type="button">Quét thiết bị mới</button>
            <div className={styles.capacity}>
              <div />
            </div>
            <p>65% capacity</p>
          </div>
        </aside>
      </section>
    </>
  );
}
