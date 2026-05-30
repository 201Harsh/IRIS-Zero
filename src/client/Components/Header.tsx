import { VoiceState } from "../types/type";
import {
  Mic,
  Settings,
  Volume2,
  Brain,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export const Header: React.FC<{
  voiceState: VoiceState;
  onSettings: () => void;
}> = ({ voiceState, onSettings }) => {
  const stateConfig = {
    idle: { label: "Ready", color: "text-white/60", icon: Circle },
    listening: { label: "Listening", color: "text-[#00ff88]", icon: Mic },
    thinking: { label: "Thinking", color: "text-[#00ff88]", icon: Brain },
    speaking: { label: "Speaking", color: "text-[#00ff88]", icon: Volume2 },
    ready: { label: "Ready", color: "text-white/60", icon: CheckCircle2 },
  };

  const config = stateConfig[voiceState];
  const StateIcon = config.icon;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-0 left-0 right-0 z-50 px-8 py-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-[#00ff88]/20 to-transparent border border-[#00ff88]/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#00ff88]" />
            <div className="absolute inset-0 rounded-xl bg-[#00ff88]/10 blur-md" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-lg tracking-tight">
              IRIS-ZERO
            </span>
            <span className="text-white/40 text-xs tracking-widest uppercase">
              Local AI Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
          <motion.div
            animate={
              voiceState === "listening" || voiceState === "speaking"
                ? { scale: [1, 1.2, 1] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <StateIcon className={`w-4 h-4 ${config.color}`} />
          </motion.div>
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
          {voiceState === "listening" && (
            <div className="flex gap-0.5">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-3 bg-[#00ff88] rounded-full"
                  animate={{ height: [6, 16, 6] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[#00ff88] text-xs font-medium">Local</span>
          </div>
          <button
            onClick={onSettings}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            <Settings className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
