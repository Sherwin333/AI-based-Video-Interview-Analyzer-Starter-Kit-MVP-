type ReportItem = {
  id: string;
  title: string;
  date: string;
  score: string;
};

const mockReports: ReportItem[] = [
  {
    id: "1",
    title: "Mock Interview #1",
    date: "2025-09-01",
    score: "82%",
  },
  {
    id: "2",
    title: "Mock Interview #2",
    date: "2025-09-04",
    score: "76%",
  },
  {
    id: "3",
    title: "Mock Interview #3",
    date: "2025-09-05",
    score: "89%",
  },
];

export default function Report() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold leading-tight">Reports</h1>
          <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:scale-[1.02] active:scale-95 transition text-white font-semibold shadow">
            Export All
          </button>
        </div>

        {/* List of reports */}
        {mockReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="glass-card p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{report.title}</h3>
                  <p className="text-sm text-white/60 mt-1">{report.date}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-white/70">Score</span>
                  <span className="text-xl font-bold text-indigo-400">
                    {report.score}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-white/6 text-sm">
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-white/6 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl p-6 bg-gradient-to-b from-white/4 to-white/6 border border-white/6 shadow-xl text-center text-white/70">
            No reports yet. Record a mock interview to see results here.
          </div>
        )}
      </div>
    </div>
  );
}
