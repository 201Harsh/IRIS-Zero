export type VoiceState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "ready";

export type RecordingState = "idle" | "recording" | "processing" | "speaking";

export interface SystemStatus {
  ollama: boolean;
  tts: boolean;
  modelName: string;
  cpuUsage: number;
  memoryUsage: number;
}

export interface ExecutionTask {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "error";
  progress?: number;
}
