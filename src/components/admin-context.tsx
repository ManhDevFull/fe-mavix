"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AdminContextType = {
    title: string;
    description: string;
    slug: string;
    setTitle: (title: string) => void;
    setDescription: (desc: string) => void;
    setSlug: (slug: string) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState("Dashboard");
    const [description, setDescription] = useState("Management overview");
    const [slug, setSlug] = useState("");

    return (
        <AdminContext.Provider value={{ title, description, slug, setTitle, setDescription, setSlug }}>
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
