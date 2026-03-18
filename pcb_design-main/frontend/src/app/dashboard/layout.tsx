"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { NodeCanvas } from "@/components/ui/NodeCanvas";
import { PlatformProvider } from "@/lib/platform-context";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PlatformProvider>
            <div className="flex h-screen w-full overflow-hidden font-sans text-[#17141f] bg-[radial-gradient(circle_at_top_left,rgba(255,155,113,0.18),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(122,231,199,0.12),transparent_18%),linear-gradient(180deg,#f6efe5_0%,#efe5d4_100%)]">
                <NodeCanvas />

                {/* Navigation Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 relative z-10">

                    {/* Top Header Bar */}
                    <header className="h-14 flex items-center justify-between px-6 z-20 flex-shrink-0 border-b border-[#17141f]/8 bg-white/45 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ff8a5b] animate-pulse" />
                            <span className="text-[10px] font-mono text-[#17141f]/50 uppercase tracking-[0.25em]">
                                Novaforge Online
                            </span>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[8px] text-[#17141f]/30 uppercase tracking-[0.3em] font-mono">Active Workspace</span>
                                <span className="text-sm font-display text-[#17141f] font-semibold tracking-tight leading-none mt-0.5">
                                    Nova Canvas Session
                                </span>
                            </div>
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-white/65 border border-[#17141f]/10 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#ff9b71] to-[#7ae7c7] opacity-90" />
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-auto relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="dashboard-content"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Status Bar */}
                    <footer className="h-7 bg-white/45 border-t border-[#17141f]/8 flex items-center justify-between px-5 text-[9px] font-mono text-[#17141f]/32 z-20 flex-shrink-0">
                        <div className="flex items-center gap-5">
                            <span className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-emerald-500/60" />
                                ENGINE_LINK: LIVE
                            </span>
                            <span>LATENCY: 14ms</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <span className="hidden sm:inline">TS_2024.02.24_02:33:00</span>
                            <span className="text-[#8a3f20]/60">SESSION_CAPTURE_ON</span>
                        </div>
                    </footer>
                </main>
            </div>
        </PlatformProvider>
    );
}
