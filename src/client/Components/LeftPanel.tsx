import { SystemStatus } from "../types/type";
import { Volume2, Activity, Brain, Terminal } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { motion } from "framer-motion";

export const LeftPanel: React.FC<{
  status: SystemStatus;
  transcript: string;
  isActive: boolean;
}> = ({ status, transcript, isActive }) => {
  const services = [
    { label: "Ollama", active: status.ollama, icon: Brain },
    { label: "TTS", active: status.tts, icon: Volume2 },
  ];
  const words = transcript.split(" ");

  return (
    <div className="absolute left-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 w-80 pointer-events-none">
      <GlassCard delay={0.2} className="w-full pointer-events-auto">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#00ff88]/60" />
            <span className="text-white/40 text-xs uppercase tracking-widest">
              System Health
            </span>
          </div>
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <service.icon className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-white/70 text-sm">{service.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${service.active ? "bg-[#00ff88]" : "bg-red-500"} ${service.active ? "animate-pulse" : ""}`}
                  />
                  <span
                    className={`text-xs ${service.active ? "text-[#00ff88]/80" : "text-red-400/80"}`}
                  >
                    {service.active ? "Active" : "Offline"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-xs">CPU</span>
              <span className="text-white/60 text-xs">{status.cpuUsage}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#00ff88]"
                initial={{ width: 0 }}
                animate={{ width: `${status.cpuUsage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <span className="text-white/40 text-xs">Memory</span>
              <span className="text-white/60 text-xs">
                {status.memoryUsage}%
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#00ff88]/70"
                initial={{ width: 0 }}
                animate={{ width: `${status.memoryUsage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="w-full pointer-events-auto" glow={isActive}>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-[#00ff88]/60" />
            <span className="text-white/40 text-xs uppercase tracking-widest">
              Transcription
            </span>
          </div>
          <div className="min-h-[3rem] flex items-center">
            <p className="text-white/90 text-sm leading-relaxed font-light">
              {transcript ? (
                words.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="inline-block mr-1.5"
                  >
                    {word}
                  </motion.span>
                ))
              ) : (
                <span className="text-white/30 italic">Awaiting audio...</span>
              )}
              {isActive && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-[#00ff88] ml-1 align-middle"
                />
              )}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
