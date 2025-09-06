import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

type Props = { onStop: (blob: Blob) => void };

/**
 * Redesigned WebcamRecorder (visuals only)
 * - Keeps all recording logic (MediaRecorder, chunks, onStop) intact.
 * - Adds a polished container, recording indicator and subtle controls.
 * - Barely introduces a UI-only timer (does not affect recording logic).
 */

export default function WebcamRecorder({ onStop }: Props) {
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [capturing, setCapturing] = useState(false);

  // UI-only elapsed timer for better UX (does not control recording)
  const [secs, setSecs] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // cleanup timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startUiTimer = () => {
    setSecs(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setSecs((s) => s + 1), 1000);
  };

  const stopUiTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCapture = async () => {
    setCapturing(true);
    startUiTimer();

    const stream = (webcamRef.current as any)?.stream as MediaStream | undefined;
    if (!stream) {
      console.error("No webcam stream available");
      setCapturing(false);
      stopUiTimer();
      return;
    }

    // prefer video/webm; browser may choose its best supported type
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
    chunksRef.current = [];
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      chunksRef.current = [];
      onStop(blob);
      stopUiTimer();
      setSecs(0);
    };

    mr.start();
  };

  const stopCapture = () => {
    mediaRecorderRef.current?.stop();
    setCapturing(false);
    // mr.onstop will be called which triggers onStop and stops timer
  };

  // format seconds as mm:ss
  const fmt = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl overflow-hidden border border-white/6 bg-gradient-to-b from-white/4 to-white/6 shadow-lg">
        {/* Camera area */}
        <div className="relative bg-black">
          <Webcam
            ref={webcamRef as any}
            audio
            mirrored
            className="w-full aspect-video object-cover"
          />

          {/* top-left badge */}
          <div className="absolute left-3 top-3 flex items-center gap-2 bg-white/6 px-2 py-1 rounded-full text-xs">
            <svg className="w-3 h-3 text-red-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="6" />
            </svg>
            <span className="text-white/90">{capturing ? "Recording" : "Ready"}</span>
          </div>

          {/* top-right timer */}
          <div className="absolute right-3 top-3 text-xs bg-black/40 px-2 py-1 rounded-full text-white/90">
            {fmt(secs)}
          </div>

          {/* center overlay hint when not recording */}
          {!capturing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-4 py-2 bg-black/30 rounded-full text-sm text-white/70 backdrop-blur-sm">
                Click <span className="font-semibold mx-1">Start</span> to record
              </div>
            </div>
          )}
        </div>

        {/* controls */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={capturing ? stopCapture : startCapture}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-shadow ${
                capturing
                  ? "bg-red-500 hover:brightness-95 text-white shadow-lg"
                  : "bg-emerald-600 hover:brightness-95 text-white shadow-lg"
              }`}
            >
              {capturing ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                  </svg>
                  Stop
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="6" fill="currentColor" />
                  </svg>
                  Start
                </>
              )}
            </button>

            <button
              onClick={() => {
                // lightweight UI-only snapshot preview (no change to recording logic)
                try {
                  const cam = (webcamRef.current as any) as Webcam;
                  const image = cam?.getScreenshot?.();
                  if (image) {
                    const w = window.open("");
                    if (w) w.document.write(`<img src="${image}" alt="snapshot" />`);
                  }
                } catch (e) {
                  console.warn("Snapshot failed", e);
                }
              }}
              className="px-3 py-2 rounded-lg bg-white/6 text-sm"
            >
              Snapshot
            </button>
          </div>

          <div className="text-sm text-white/70">
            <div>Format: webm • Auto-selected by browser</div>
          </div>
        </div>
      </div>
    </div>
  );
}
