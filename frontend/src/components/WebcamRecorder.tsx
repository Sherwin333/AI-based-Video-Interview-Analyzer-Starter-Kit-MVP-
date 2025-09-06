import { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function WebcamRecorder({ onStop }: { onStop: (blob: Blob) => void }) {
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [capturing, setCapturing] = useState(false);

  const startCapture = async () => {
    setCapturing(true);

    const stream = (webcamRef.current as any)?.stream as MediaStream | undefined;
    if (!stream) {
      console.error("No webcam stream available");
      setCapturing(false);
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
    };

    mr.start();
  };

  const stopCapture = () => {
    mediaRecorderRef.current?.stop();
    setCapturing(false);
  };

  return (
    <div className="space-y-3">
      <Webcam ref={webcamRef as any} audio mirrored className="rounded-2xl w-full" />
      {capturing ? (
        <button onClick={stopCapture} className="px-4 py-2 rounded-xl bg-red-500 text-white">
          Stop
        </button>
      ) : (
        <button onClick={startCapture} className="px-4 py-2 rounded-xl bg-emerald-600 text-white">
          Start
        </button>
      )}
    </div>
  );
}
