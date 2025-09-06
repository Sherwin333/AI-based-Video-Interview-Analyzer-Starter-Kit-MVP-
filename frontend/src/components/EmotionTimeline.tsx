import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

type SeriesPoint = { t: number; emotions: Record<string, number> };

export default function EmotionTimeline({ series }: { series: SeriesPoint[] }) {
  // keep the same emotion keys your logic expects
  const keys = [
    "happy",
    "neutral",
    "sad",
    "angry",
    "fear",
    "surprise",
    "disgust",
  ];

  // build data in the same shape as before (t + each emotion key)
  const data = series.map((p) =>
    keys.reduce(
      (acc, k) => {
        acc[k] = p.emotions?.[k] ?? 0;
        return acc;
      },
      { t: p.t } as Record<string, number>
    )
  );

  // friendly time formatter (assumes t is seconds — if milliseconds, adapt accordingly)
  const fmtTime = (seconds: number) => {
    const s = Math.floor(seconds);
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // light, contrasting palette suitable for the dark gradient shell
  const strokes = {
    happy: "#60a5fa", // sky
    neutral: "#94a3b8", // slate
    sad: "#7dd3fc", // light cyan
    angry: "#fb7185", // rose
    fear: "#f59e0b", // amber
    surprise: "#a78bfa", // violet
    disgust: "#34d399", // emerald
  } as Record<string, string>;

  return (
    <div className="rounded-2xl p-3 bg-gradient-to-br from-white/4 to-white/6 border border-white/6 shadow-md h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="t"
            tickFormatter={fmtTime}
            stroke="rgba(255,255,255,0.6)"
            tick={{ fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          />
          <YAxis
            domain={[0, 1]}
            stroke="rgba(255,255,255,0.6)"
            tick={{ fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickFormatter={(v) => `${Math.round((v as number) * 100)}%`}
          />
          <Tooltip
            contentStyle={{ background: "rgba(0,0,0,0.7)", border: "none" }}
            itemStyle={{ color: "#fff" }}
            labelFormatter={(label) => `Time: ${fmtTime(Number(label))}`}
            formatter={(value: any, name: string) => {
              const pct =
                typeof value === "number" ? `${(value * 100).toFixed(1)}%` : value;
              return [pct, name];
            }}
          />
          <Legend wrapperStyle={{ color: "rgba(255,255,255,0.8)" }} />
          {keys.map((k) => (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              stroke={strokes[k] ?? "#fff"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={700}
              connectNulls
              opacity={0.95}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
