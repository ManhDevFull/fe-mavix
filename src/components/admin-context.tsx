"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "./toast-provider";
import { readAuth } from "../lib/auth";

type AdminContextType = {
    title: string;
    description: string;
    slug: string;
    plan: "free" | "plus" | "pro" | "premium" | "edition";
    restaurantId: number | null;
    setTitle: (title: string) => void;
    setDescription: (desc: string) => void;
    setSlug: (slug: string) => void;
    setPlan: (plan: "free" | "plus" | "pro" | "premium" | "edition") => void;
    setRestaurantId: (id: number | null) => void;
    socket: Socket | null;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState("Dashboard");
    const [description, setDescription] = useState("Management overview");
    const [slug, setSlug] = useState("");
    const [plan, setPlan] = useState<"free" | "plus" | "pro" | "premium" | "edition">("free");
    const [restaurantId, setRestaurantId] = useState<number | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const toast = useToast();

    // Socket Connection
    useEffect(() => {
        const auth = readAuth();
        const token = auth?.accessToken;

        if (!token || !restaurantId) {
            if (socket) {
                console.log("Disconnecting socket due to missing auth or restaurantId");
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
            auth: {
                token: `Bearer ${token}`
            }
        });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            newSocket.emit("join_restaurant", restaurantId);
        });

        newSocket.on("new_order", (data) => {
            console.log("Real-time: New order received", data);
            toast.success(
                "ĐƠN HÀNG MỚI!",
                `Bàn ${data.tableCode} vừa gọi món mới. Hệ thống đã tự động cập nhật.`
            );
        });

        newSocket.on("bill_requested", (data) => {
            console.log("Real-time: Bill requested", data);
            toast.info(
                "YÊU CẦU IN BILL",
                `Bàn ${data.tableCode} (${data.displayName}) vừa gọi nhân viên.`
            );
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [restaurantId]);

    return (
        <AdminContext.Provider value={{
            title, description, slug, plan, restaurantId,
            setTitle, setDescription, setSlug, setPlan, setRestaurantId,
            socket
        }}>
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
