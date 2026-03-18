"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MechButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export const MechButton = React.forwardRef<HTMLButtonElement, MechButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const variants = {
            primary: "bg-[#17141f] border-[#17141f] text-[#fff7ed] hover:bg-[#262132] hover:border-[#262132] shadow-[0_12px_30px_rgba(23,20,31,0.18)]",
            secondary: "bg-[#ff9b71]/12 border-[#ff9b71]/30 text-[#8a3f20] hover:bg-[#ff9b71]/20 hover:border-[#ff9b71]/45",
            outline: "bg-white/55 border-[#17141f]/12 text-[#17141f]/78 hover:bg-white/85 hover:text-[#17141f] hover:border-[#17141f]/24",
            ghost: "bg-transparent border-transparent text-[#17141f]/55 hover:text-[#17141f] hover:bg-[#17141f]/5",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs font-mono tracking-tight",
            md: "px-5 py-2.5 text-sm font-display tracking-wide",
            lg: "px-8 py-4 text-base font-display font-medium tracking-wider uppercase",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ translateY: -1 }}
                whileTap={{ translateY: 1, scale: 0.98 }}
                className={cn(
                    "relative border rounded-[1.05rem] transition-all duration-100 flex items-center justify-center gap-2 group overflow-hidden",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_45%,transparent)] opacity-60" />

                <span className="relative z-10">{children}</span>
            </motion.button>
        );
    }
);

MechButton.displayName = "MechButton";
