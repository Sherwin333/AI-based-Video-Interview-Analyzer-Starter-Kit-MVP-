export default function MetricCard({ label, value }: { label: string; value:
string | number }) {
return (
<div className="rounded-2xl border p-4 shadow-sm">
<div className="text-gray-500 text-sm">{label}</div>
<div className="text-2xl font-semibold">{value}</div>
</div>
);
}