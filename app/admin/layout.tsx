"use client";

import { useState } from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminTopbar from "../components/Admin/AdminTopbar";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar open={open} toggle={() => setOpen(!open)} />

            <div className="flex flex-col flex-1">
                <AdminTopbar toggleSidebar={() => setOpen(!open)} />
                <main className="">
                    <motion.main
                        className=""
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {children}
                    </motion.main></main>
            </div>
        </div>
    );
}
