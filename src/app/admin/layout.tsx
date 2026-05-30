"use client";

import { AdminProvider } from "../../components/admin-context";
import { AdminShell } from "../../components/admin-shell";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AdminProvider>
            <AdminShell>
                {children}
            </AdminShell>
        </AdminProvider>
    );
}
