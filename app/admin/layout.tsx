"use client";

import { useState } from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminTopbar from "../components/Admin/AdminTopbar";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="flex h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
             <AdminSidebar 
               open={open} toggle={() => setOpen(!open)}
             />
             
             <div className="flex-1 flex flex-col overflow-hidden">
               <AdminTopbar toggleSidebar={() => setOpen(!open)}/>
               
               <motion.main
                 className="flex-1 overflow-auto p-6"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
               >
                 <div className="max-w-7xl mx-auto">
       
                   {/* Main Content */}
                   <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-6 min-h-[calc(100vh-200px)]">
                     {children}
                   </div>
       
                   {/* Footer */}
                   <motion.footer 
                     className="mt-8 text-center text-amber-600 text-sm"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.4 }}
                   >
                     <p>© 2024 Vairaa Coders. All rights reserved.</p>
                     <p className="mt-1">Made with ❤️ and lots of ☕</p>
                   </motion.footer>
                 </div>
               </motion.main>
             </div>
           </div>
    );
}
