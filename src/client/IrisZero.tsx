import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain, CheckCircle2, Loader2, X, Circle } from "lucide-react";
import {
  ExecutionTask,
  RecordingState,
  SystemStatus,
  VoiceState,
} from "./types/type";
import { Header } from "./Components/Header";
import { LeftPanel } from "./Components/LeftPanel";
import { RightPanel } from "./Components/RightPanel";
import { GlobeAI } from "./Components/NeuralGlobe";
import { GlassCard } from "./Components/ui/GlassCard";
import { Dock } from "./Components/Dock";

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#00ff88]/3 rounded-full blur-[150px]" />
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
            className="absolute inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm"
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
