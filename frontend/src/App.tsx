import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Interview from "./pages/Interview";
import Report from "./pages/Report";

/**
 * Redesigned App shell
 * - Keeps your routing & page components untouched.
 * - Pure Tailwind + semantic structure (no extra deps).
 * - Responsive topbar + left nav. Main content area renders your pages.
 */

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-800 text-slate-100">
        {/* Top bar */}
        <header className="sticky top-0 z-40 backdrop-blur-sm bg-white/4 border-b border-white/6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="rounded-md px-3 py-1 bg-gradient-to-r from-indigo-600 to-pink-500 shadow">
                  <span className="font-extrabold tracking-tight text-lg">Interview</span>
                  <span className="ml-2 text-xs text-white/80">Analyzer</span>
                </div>

                <nav className="hidden sm:flex items-center gap-2 ml-4">
                  <Link
                    to="/"
                    className="px-3 py-1 rounded-lg hover:bg-white/6 transition text-sm font-medium"
                  >
                    Interview
                  </Link>

                  <Link
                    to="/report"
                    className="px-3 py-1 rounded-lg hover:bg-white/6 transition text-sm font-medium"
                  >
                    Report
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center bg-white/5 rounded-full px-3 py-1 text-sm text-white/70">
                  <svg className="w-4 h-4 mr-2 opacity-70" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    className="bg-transparent outline-none placeholder:text-white/40 text-sm w-44"
                    placeholder="Search candidates..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button className="hidden sm:inline px-3 py-1 rounded-lg bg-white/6 hover:bg-white/8 transition text-sm">
                    Settings
                  </button>

                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    SD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Left navigation (small) */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="sticky top-24 rounded-2xl p-4 bg-white/4 border border-white/6 backdrop-blur-md shadow">
                <div className="text-sm font-semibold mb-3">Navigation</div>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="block px-3 py-2 rounded-lg hover:bg-white/6 transition text-sm"
                    >
                      Interview Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/report"
                      className="block px-3 py-2 rounded-lg hover:bg-white/6 transition text-sm"
                    >
                      Reports
                    </Link>
                  </li>
                </ul>
                <div className="mt-4 border-t border-white/6 pt-3 text-sm text-white/70">
                  Tips: use the preview panel to check webcam & recordings.
                </div>
              </div>
            </aside>

            {/* Main content: renders your pages exactly as before */}
            <main className="col-span-12 lg:col-span-9">
              <div className="rounded-3xl p-6 bg-gradient-to-b from-white/4 to-white/6 border border-white/6 shadow-xl min-h-[60vh]">
                {/* NOTE: I DID NOT CHANGE these components or their props — only where they render */}
                <Routes>
                  <Route path="/" element={<Interview />} />
                  <Route path="/report" element={<Report />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>

        {/* Decorative blurred shapes (purely visual) */}
        <div aria-hidden className="pointer-events-none -z-10">
          <div className="absolute left-0 top-0 w-96 h-96 rounded-full blur-3xl bg-gradient-to-tr from-indigo-600/30 to-transparent opacity-30 transform -translate-x-1/2 -translate-y-1/3" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-2xl bg-gradient-to-bl from-pink-500/20 to-transparent opacity-25 transform translate-x-1/4 translate-y-1/3" />
        </div>
      </div>
    </BrowserRouter>
  );
}
