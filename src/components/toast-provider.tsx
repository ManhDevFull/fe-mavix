"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import styles from "./toast-provider.module.css";

type ToastType = "accent" | "success" | "error";

type ToastItem = {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
};

type ToastInput = {
  type?: ToastType;
  title: string;
  description?: string;
};

type ToastContextValue = {
  pushToast: (input: ToastInput) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (input: ToastInput) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const toast: ToastItem = {
        id,
        type: input.type ?? "accent",
        title: input.title,
        description: input.description
      };

      setToasts((current) => [...current, toast]);
      window.setTimeout(() => dismiss(id), 3600);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      pushToast,
      success: (title, description) => pushToast({ type: "success", title, description }),
      error: (title, description) => pushToast({ type: "error", title, description }),
      info: (title, description) => pushToast({ type: "accent", title, description })
    }),
    [pushToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
            <div className={styles.content}>
              <strong>{toast.title}</strong>
              {toast.description ? <p>{toast.description}</p> : null}
            </div>
            <button type="button" className={styles.close} onClick={() => dismiss(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
