import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Mic,
  Square,
  Loader2,
  Volume2,
  VolumeX,
  X,
  Settings,
} from "lucide-react";
import { RecordingState } from "../types/type";

export const Dock: React.FC<{
  recordingState: RecordingState;
  isMuted: boolean;
  onMuteToggle: () => void;
  onInterrupt: () => void;
  onSettings: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}> = ({
  recordingState,
  isMuted,
  onMuteToggle,
  onInterrupt,
  onSettings,
  onHoldStart,
  onHoldEnd,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";

  useEffect(() => {
    if (buttonRef.current && isRecording) {
      gsap.to(buttonRef.current, {
        scale: 1.1,
        duration: 0.8,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    } else if (buttonRef.current) {
      gsap.killTweensOf(buttonRef.current);
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isRecording]);

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-6"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMuteToggle}
            className={`p-3.5 rounded-2xl border transition-all duration-300 ${isMuted ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onInterrupt}
            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSettings}
            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Push-to-Talk Mic Button */}
        <div className="relative flex flex-col items-center gap-6">
          {isRecording && (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-[#00ff88]/30 pointer-events-none"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}

          <motion.button
            ref={buttonRef}
            onPointerDown={(e) => {
              // Prevent default touch behaviors that might interrupt the hold
              e.preventDefault();
              onHoldStart();
            }}
            onPointerUp={onHoldEnd}
            onPointerLeave={onHoldEnd}
            onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu interrupting hold
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ touchAction: "none" }} // Ensure touch devices don't scroll while holding
            className={`
              relative w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-500 cursor-pointer
              ${
                isRecording
                  ? "bg-[#00ff88] shadow-[0_0_60px_rgba(0,255,136,0.4)]"
                  : isProcessing
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00ff88]/30"
              }
            `}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
            ) : isRecording ? (
              <Square className="w-8 h-8 text-[#050505] fill-current" />
            ) : (
              <Mic className="w-8 h-8 text-white/80" />
            )}
            <div
              className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none ${isRecording ? "opacity-100" : "opacity-0"} bg-linear-to-br from-[#00ff88]/20 to-transparent blur-md`}
            />
          </motion.button>

          <span className="text-white/40 text-sm font-medium absolute -bottom-8 whitespace-nowrap">
            {isRecording
              ? "Listening..."
              : isProcessing
                ? "Processing..."
                : "Hold to Talk"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
