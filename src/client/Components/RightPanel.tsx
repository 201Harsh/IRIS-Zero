import { Cpu, Wifi } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { motion } from "framer-motion";

export const RightPanel: React.FC<{
  currentTask: string;
  modelName: string;
}> = ({ currentTask, modelName }) => (
  <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 w-64 pointer-events-none">
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <GlassCard className="pointer-events-auto">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-[#00ff88]/60" />
            <span className="text-white/40 text-xs uppercase tracking-widest">
              Execution Status
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-white/40 text-xs block mb-1">
                Current Task
              </span>
              <span className="text-white/80 text-sm">
                {currentTask || "Idle"}
              </span>
            </div>
            <div>
              <span className="text-white/40 text-xs block mb-1">Model</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-[#00ff88]/80 text-sm font-medium">
                  {modelName}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Wifi className="w-3 h-3" />
                <span>Local inference active</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  </div>
);
