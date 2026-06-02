"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "../../../components/admin-shell";
import { apiFetch } from "../../../lib/api";
import { useToast } from "../../../components/toast-provider";
import styles from "./menu.module.css";

type MenuData = {
  items: Array<{
    id: number;
    name: string;
    description: string | null;
    price: number;
    isAvailable: boolean;
  }>;
};

type MenuForm = {
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
};

const emptyForm: MenuForm = {
  name: "",
  description: "",
  price: 0,
  isAvailable: true
};

import { useAdmin } from "../../../components/admin-context";

export default function MenuPage() {
  const { setTitle, setDescription } = useAdmin();
  const toast = useToast();
  const [data, setData] = useState<MenuData | null>(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const formRef = useRef<HTMLFormElement | null>(null);

  async function loadMenu() {
    setData(await apiFetch<MenuData>("/admin/menu"));
  }

  useEffect(() => {
    setTitle("QUẢN LÝ THỰC ĐƠN");
    setDescription("Danh sách món ăn và trạng thái phục vụ");
    loadMenu().catch((error) =>
      toast.error("Không tải được thực đơn", error instanceof Error ? error.message : undefined)
    );
  }, [setTitle, setDescription]);

  async function saveItem(event: FormEvent) {
    event.preventDefault();

    try {
      if (editingId) {
        await apiFetch(`/admin/menu/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(form)
        });
        toast.success("Đã cập nhật món", form.name);
      } else {
        await apiFetch("/admin/menu", {
          method: "POST",
          body: JSON.stringify(form)
        });
        toast.success("Đã thêm món mới", form.name);
      }

      setEditingId(null);
      setForm(emptyForm);
      await loadMenu();
    } catch (error) {
      toast.error("Không lưu được món", error instanceof Error ? error.message : undefined);
    }
  }

  function startEdit(item: MenuData["items"][number]) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description ?? "",
      price: item.price,
      isAvailable: !!item.isAvailable
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function removeItem(itemId: number) {
    try {
      const currentItem = data?.items.find((item) => item.id === itemId);
      await apiFetch(`/admin/menu/${itemId}`, { method: "DELETE" });
      if (editingId === itemId) {
        setEditingId(null);
        setForm(emptyForm);
      }
      toast.success("Đã xóa món", currentItem?.name);
      await loadMenu();
    } catch (error) {
      toast.error("Không xóa được món", error instanceof Error ? error.message : undefined);
    }
  }

  const visibleItems = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.items.filter((item) => {
      const searchMatch =
        search.trim() === "" ||
        `${item.name} ${item.description ?? ""}`.toLowerCase().includes(search.toLowerCase());
      return searchMatch;
    });
  }, [data, search]);

  return (
    <>
      <section className={styles.headerBar}>
        <input
          className={styles.search}
          placeholder="Tìm kiếm món ăn..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <section className={styles.layout}>
        <form className={styles.creator} onSubmit={saveItem} ref={formRef}>
          <div className={styles.creatorHead}>
            <h3>{editingId ? "Cập nhật món ăn" : "Tạo món ăn"}</h3>
            {editingId ? <span className={styles.editTag}>Đang sửa</span> : null}
          </div>
          <input
            placeholder="Tên món"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <textarea
            placeholder="Mô tả món ăn"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Giá bán"
            value={form.price || ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, price: Number(event.target.value) }))
            }
          />
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(event) =>
                setForm((current) => ({ ...current, isAvailable: event.target.checked }))
              }
            />
            <span>Còn bán</span>
          </label>
          <div className={styles.formActions}>
            <button type="submit">{editingId ? "Lưu thay đổi" : "Lưu món"}</button>
            {editingId ? (
              <button
                type="button"
                className={styles.secondary}
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Hủy sửa
              </button>
            ) : null}
          </div>
        </form>

        <div className={styles.cards}>
          {visibleItems.map((item) => (
            <article key={item.id} className={styles.menuCard}>
              <div className={styles.imageStub}>
                <span>{item.isAvailable ? "Còn hàng" : "Tạm ngưng"}</span>
              </div>
              <div className={styles.body}>
                <div className={styles.topLine}>
                  <strong>{item.name}</strong>
                  <b>{item.price.toLocaleString("vi-VN")}đ</b>
                </div>
                <p>{item.description ?? "Chưa có mô tả cho món này."}</p>
                <div className={styles.footer}>
                  <i className={item.isAvailable ? styles.available : styles.unavailable}>
                    {item.isAvailable ? "Đang bán" : "Tạm ngưng"}
                  </i>
                  <div className={styles.actions}>
                    <button type="button" onClick={() => startEdit(item)}>
                      Sửa
                    </button>
                    <button type="button" onClick={() => removeItem(item.id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {visibleItems.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#999', width: '100%' }}>Chưa có món ăn nào.</p>}
        </div>
      </section>
    </>
  );
}
