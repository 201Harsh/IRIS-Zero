import React from "react";
import { motion } from "framer-motion";

export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
}> = ({ children, className = "", glow = false, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`
      relative overflow-hidden
      backdrop-blur-2xl bg-white/3
      border border-white/8
      rounded-3xl
      ${glow ? "shadow-[0_0_60px_-15px_rgba(0,255,136,0.15)]" : "shadow-2xl shadow-black/40"}
      ${className}
    `}
  >
    {glow && (
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#00ff88]/5 via-transparent to-transparent pointer-events-none" />
    )}
    <div className="relative z-10">{children}</div>
  </motion.div>
);
