import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  Mic,
  Settings,
  Volume2,
  VolumeX,
  Activity,
  Cpu,
  Zap,
  Brain,
  CheckCircle2,
  Loader2,
  X,
  Circle,
  Square,
  Wifi,
  Terminal,
  Sparkles,
} from "lucide-react";
import {
  ExecutionTask,
  RecordingState,
  SystemStatus,
  VoiceState,
} from "./types/type";

// ─── 2. Header Component ─────────────────────────────────────────────

// ─── 3. Left Panel (Health + Transcription) ──────────────────────────

const LeftPanel: React.FC<{
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

// ─── 4. Right Panel (Execution Status) ───────────────────────────────

const RightPanel: React.FC<{
  currentTask: string;
  modelName: string;
}> = ({ currentTask, modelName }) => (
  <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 w-64 pointer-events-none">
    <GlassCard delay={0.3} className="pointer-events-auto">
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
  </div>
);

// ─── 5. Dock (Voice Controls) ────────────────────────────────────────

const Dock: React.FC<{
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
              className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none ${isRecording ? "opacity-100" : "opacity-0"} bg-gradient-to-br from-[#00ff88]/20 to-transparent blur-md`}
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

// ─── Main Application ────────────────────────────────────────────────

const IRISZero: React.FC = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [tasks, setTasks] = useState<ExecutionTask[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const [systemStatus] = useState<SystemStatus>({
    ollama: true,
    tts: true,
    modelName: "llama3.1:8b",
    cpuUsage: 24,
    memoryUsage: 42,
  });

  // Simulated transcription stream
  const simulateProcessing = useCallback(async () => {
    const words = "Create a Next.js project and install dependencies".split(
      " ",
    );
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 150));
      setTranscript((prev) => prev + (prev ? " " : "") + words[i]);
    }

    await new Promise((r) => setTimeout(r, 1000));
    setVoiceState("speaking");
    setRecordingState("speaking");
    setCurrentTask("Project initialization");

    const responseWords =
      "Creating project... Installing dependencies... Ready.".split(" ");
    for (let i = 0; i < responseWords.length; i++) {
      await new Promise((r) => setTimeout(r, 150));
      setResponse((prev) => prev + (prev ? " " : "") + responseWords[i]);
    }

    setTasks([
      {
        id: "1",
        label: "Initialize Next.js project",
        status: "completed",
        progress: 100,
      },
      {
        id: "2",
        label: "Install dependencies",
        status: "running",
        progress: 65,
      },
      { id: "3", label: "Configure Tailwind CSS", status: "pending" },
    ]);

    await new Promise((r) => setTimeout(r, 2000));
    setTasks((prev) =>
      prev.map((t) => ({ ...t, status: "completed" as const, progress: 100 })),
    );
    setVoiceState("ready");
    setRecordingState("idle");
    setCurrentTask("Completed");

    await new Promise((r) => setTimeout(r, 3000));
    setVoiceState("idle");
    setTranscript("");
    setResponse("");
    setTasks([]);
    setCurrentTask("");
  }, []);

  // Strict Hold-to-Talk Handlers
  const handleHoldStart = () => {
    if (recordingState === "idle" || recordingState === "speaking") {
      setVoiceState("listening");
      setRecordingState("recording");
      setTranscript("");
      setResponse("");
      setTasks([]);
    }
  };

  const handleHoldEnd = () => {
    if (recordingState === "recording") {
      setRecordingState("processing");
      setVoiceState("thinking");
      simulateProcessing();
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#050505] overflow-hidden font-sans selection:bg-[#00ff88]/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00cc6a]/5 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/3 rounded-full blur-[150px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <Header
        voiceState={voiceState}
        onSettings={() => setShowSettings(true)}
      />

      <LeftPanel
        status={systemStatus}
        transcript={transcript}
        isActive={voiceState === "listening"}
      />

      <RightPanel
        currentTask={currentTask}
        modelName={systemStatus.modelName}
      />

      <Dock
        recordingState={recordingState}
        isMuted={isMuted}
        onMuteToggle={() => setIsMuted(!isMuted)}
        onInterrupt={() => {
          setVoiceState("idle");
          setRecordingState("idle");
          setTranscript("");
          setResponse("");
        }}
        onSettings={() => setShowSettings(true)}
        onHoldStart={handleHoldStart}
        onHoldEnd={handleHoldEnd}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 pointer-events-none">
        <GlobeAI voiceState={voiceState} />

        <div className="w-full max-w-2xl mt-4 z-30 pointer-events-auto">
          <AnimatePresence mode="wait">
            {response ? (
              <GlassCard key="response-card" glow={!!response}>
                <div className="px-8 py-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-4 h-4 text-[#00ff88]/60" />
                    <span className="text-white/40 text-xs uppercase tracking-widest">
                      Assistant Response
                    </span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-white/80 text-base leading-relaxed font-light">
                      {response}
                    </p>
                    {tasks && tasks.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5"
                          >
                            {task.status === "running" ? (
                              <Loader2 className="w-4 h-4 text-[#00ff88] animate-spin" />
                            ) : task.status === "completed" ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                            ) : (
                              <Circle className="w-4 h-4 text-white/30" />
                            )}
                            <span className="text-white/70 text-sm flex-1">
                              {task.label}
                            </span>
                            {task.progress !== undefined && (
                              <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-[#00ff88] rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${task.progress}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {currentTask && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-center gap-2 text-[#00ff88]/80 text-sm"
                      >
                        <Zap className="w-4 h-4" />
                        {currentTask}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </GlassCard>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/30 text-sm italic text-center"
              >
                Awaiting input...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg mx-4"
            >
              <GlassCard glow className="w-full">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-white text-xl font-semibold">
                      Settings
                    </h2>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-white/60" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {[
                      {
                        label: "Voice Activation",
                        desc: "Enable wake word detection",
                        enabled: true,
                      },
                      {
                        label: "Local TTS",
                        desc: "Use local text-to-speech engine",
                        enabled: true,
                      },
                      {
                        label: "Auto Execute",
                        desc: "Run commands without confirmation",
                        enabled: false,
                      },
                      {
                        label: "Debug Mode",
                        desc: "Show technical details",
                        enabled: false,
                      },
                    ].map((setting) => (
                      <div
                        key={setting.label}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <span className="text-white/80 text-sm block">
                            {setting.label}
                          </span>
                          <span className="text-white/40 text-xs">
                            {setting.desc}
                          </span>
                        </div>
                        <button
                          className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${setting.enabled ? "bg-[#00ff88]/30" : "bg-white/10"}`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-300 ${setting.enabled ? "left-6 bg-[#00ff88]" : "left-1 bg-white/40"}`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <button className="w-full py-3 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-sm font-medium hover:bg-[#00ff88]/20 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 px-8 py-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white/30 text-xs">
          <span>IRIS-Zero v1.0.0 — Local AI Assistant</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
              All systems operational
            </span>
            <span>Privacy: 100% Local</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IRISZero;
