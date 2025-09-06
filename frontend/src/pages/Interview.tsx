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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Mock Interview</h1>
            <p className="mt-1 text-sm text-white/70 max-w-xl">
              Record your mock interview and get instant feedback — sentiment, eye contact,
              and emotion timeline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2 bg-white/6 px-3 py-1 rounded-full">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 4.93l2.83 2.83" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 16.24l2.83 2.83" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm">Analyzing…</span>
              </div>
            ) : (
              <div className="text-sm text-white/70">Ready to record</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left: Recorder + Transcript + Timeline */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            <div className="rounded-2xl p-4 bg-gradient-to-b from-white/4 to-white/6 border border-white/6 shadow-lg">
              {/* Webcam recorder: logic untouched — only visual wrapper changed */}
              <WebcamRecorder onStop={handleStop} />
            </div>

            {report && (
              <>
                <div className="rounded-2xl p-4 bg-white/3 border border-white/6">
                  <h3 className="text-lg font-semibold mb-3">Transcript</h3>
                  <div className="prose max-w-none text-white/90 whitespace-pre-wrap">
                    {report.transcript || "(no speech detected)"}
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-white/3 border border-white/6">
                  <h3 className="text-lg font-semibold mb-3">Emotion Timeline</h3>
                  <EmotionTimeline series={report.emotion_timeline || []} />
                </div>
              </>
            )}
          </section>

          {/* Right: Metrics + Quick Summary */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-700/20 to-pink-600/10 border border-white/6 shadow">
                <h4 className="text-sm font-semibold text-white/90 mb-3">Quick Metrics</h4>

                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="Overall" value={`${report?.scores?.overall ?? "-"}`} />
                  <MetricCard label="Sentiment" value={`${report?.scores?.sentiment ?? "-"}`} />
                  <MetricCard
                    label="Eye Contact"
                    value={`${report?.scores ? (report.scores.eye_contact ?? 0).toFixed(1) + "%" : "-"}`}
                  />
                  <MetricCard label="Emotion" value={`${report?.scores?.emotion ?? "-"}`} />
                </div>

                <div className="mt-4 border-t border-white/6 pt-3 text-sm text-white/70">
                  <div className="font-medium">Session summary</div>
                  <div className="mt-2 text-xs">
                    {report ? (
                      <>
                        <div>Length: <span className="font-semibold">{report.duration ?? "—"}</span></div>
                        <div>Detected words: <span className="font-semibold">{report.word_count ?? "—"}</span></div>
                      </>
                    ) : (
                      <div>No session yet. Record to see insights.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-white/4 border border-white/6">
                <h4 className="text-sm font-semibold mb-2">Actions</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="w-full px-3 py-2 rounded-lg bg-indigo-500 text-sm font-semibold"
                  >
                    Start New Recording
                  </button>
                  <button
                    onClick={() => {
                      if (!report) return;
                      // keep logic minimal here: export transcript as txt
                      const blob = new Blob([report.transcript || ""], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "transcript.txt";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/6 text-sm"
                  >
                    Export Transcript
                  </button>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-white/5 border border-white/6 text-sm text-white/70">
                <div className="font-semibold mb-1">Tips to improve</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep camera at eye level for better eye-contact detection.</li>
                  <li>Speak clearly — microphone quality affects transcript accuracy.</li>
                  <li>Short, focused answers often score higher.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
