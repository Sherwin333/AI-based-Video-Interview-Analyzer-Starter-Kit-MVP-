export default function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-b from-white/5 to-white/10 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-sm font-medium text-white/70">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-white tracking-tight">
        {value}
      </div>
    </div>
  );
}
