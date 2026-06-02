"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AdminContextType = {
    title: string;
    description: string;
    slug: string;
    plan: "free" | "plus" | "pro" | "premium" | "edition";
    setTitle: (title: string) => void;
    setDescription: (desc: string) => void;
    setSlug: (slug: string) => void;
    setPlan: (plan: "free" | "plus" | "pro" | "premium" | "edition") => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState("Dashboard");
    const [description, setDescription] = useState("Management overview");
    const [slug, setSlug] = useState("");
    const [plan, setPlan] = useState<"free" | "plus" | "pro" | "premium" | "edition">("free");

    return (
        <AdminContext.Provider value={{ title, description, slug, plan, setTitle, setDescription, setSlug, setPlan }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
