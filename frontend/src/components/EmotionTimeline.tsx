import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
ResponsiveContainer } from "recharts";
export default function EmotionTimeline({ series }: { series: Array<{t:number,
emotions: Record<string, number>}> }) {
const keys = ["happy", "neutral", "sad", "angry", "fear", "surprise",
"disgust"];
const data = series.map(p => ({ t: p.t, ...keys.reduce((acc,k)=>({ ...acc,
[k]: p.emotions?.[k] ?? 0 }), {}) }));
return (
<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="t" />
<YAxis domain={[0,1]} />
<Tooltip />
<Legend />
{keys.map((k)=> <Line key={k} type="monotone" dataKey={k}
dot={false} />)}
</LineChart>
</ResponsiveContainer>
</div>
);
}
