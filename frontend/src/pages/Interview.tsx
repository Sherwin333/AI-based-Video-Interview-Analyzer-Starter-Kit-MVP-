import { useState } from "react";
import WebcamRecorder from "../components/WebcamRecorder";
import { uploadInterview } from "../lib/api";
import MetricCard from "../components/MetricCard";
import EmotionTimeline from "../components/EmotionTimeline";

export default function Interview() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleStop = async (blob: Blob) => {
    setLoading(true);
    try {
      const res = await uploadInterview(blob);
      setReport(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mock Interview</h1>
      <WebcamRecorder onStop={handleStop} />
      {loading && <div className="text-gray-600">Analyzing…</div>}
      {report && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Overall" value={`${report.scores?.overall ?? "-"}`} />
            <MetricCard label="Sentiment" value={`${report.scores?.sentiment ?? "-"}`} />
            <MetricCard
              label="Eye Contact"
              value={`${(report.scores?.eye_contact ?? 0).toFixed(1)}%`}
            />
            <MetricCard label="Emotion" value={`${report.scores?.emotion ?? "-"}`} />
          </div>

          <div className="rounded-2xl border p-4">
            <h3 className="font-semibold mb-2">Transcript</h3>
            <p className="whitespace-pre-wrap text-gray-800">
              {report.transcript || "(no speech detected)"}
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <h3 className="font-semibold mb-2">Emotion Timeline</h3>
            <EmotionTimeline series={report.emotion_timeline || []} />
          </div>
        </div>
      )}
    </div>
  );
}
