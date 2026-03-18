"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Zap,
    Cpu,
    Settings,
    LayoutDashboard,
    ShieldCheck,
    LibraryBig,
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Generate", href: "/dashboard/generate", icon: Zap },
    { name: "Placement", href: "/dashboard/placement", icon: Cpu },
    { name: "DFM Analysis", href: "/dashboard/dfm", icon: ShieldCheck },
    { name: "Templates", href: "/dashboard/templates", icon: LibraryBig },
    { name: "Architecture", href: "/dashboard/architecture", icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-56 flex flex-col bg-white/55 border-r border-[#17141f]/8 flex-shrink-0 z-20 backdrop-blur-xl">
            {/* Brand */}
            <div className="h-14 flex items-center px-5 border-b border-[#17141f]/8">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-[#ff9b71]/35 bg-[#17141f] transition-colors group-hover:border-[#ffd166]">
                        <div className="absolute h-5 w-5 rounded-full border border-[#ff9b71]/50" />
                        <div className="absolute h-2.5 w-2.5 rotate-45 rounded-[0.3rem] bg-[#ffd166]/30 border border-[#ffd166]/80" />
                        <div className="h-1.5 w-1.5 rounded-full bg-[#7ae7c7]" />
                    </div>
                    <span className="font-display font-bold text-base tracking-tight text-[#17141f]">Nova<span className="text-[#8a3f20]">forge</span></span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-0.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative text-sm",
                                isActive
                                    ? "text-[#17141f] bg-[#17141f]/6 font-medium"
                                    : "text-[#17141f]/45 hover:text-[#17141f]/80 hover:bg-white/60"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 w-1 h-6 bg-[#ff8a5b] rounded-r-full"
                                />
                            )}
                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#8a3f20]" : "group-hover:text-[#17141f]")} />
                            <span className="text-sm font-display tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Settings */}
            <div className="p-4 border-t border-[#17141f]/8">
                <button className="flex items-center gap-3 px-3 py-2 w-full text-[#17141f]/50 hover:text-[#17141f] transition-colors rounded-md group">
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                    <span className="text-sm font-display">Studio Settings</span>
                </button>
                <div className="mt-4 px-3 py-3 rounded-lg bg-white/65 border border-[#17141f]/8">
                    <div className="flex items-center justify-between text-[10px] text-[#17141f]/40 uppercase tracking-widest mb-2">
                        <span>Studio Build</span>
                        <span className="text-[#ffd166]">v3.0</span>
                    </div>
                    <div className="h-1 w-full bg-[#17141f]/8 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-[#ff9b71]/60"
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
}
