import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
export default function App() {
return (
<BrowserRouter>
<nav className="px-6 py-3 border-b flex gap-4">
<Link to="/">Interview</Link>
<Link to="/report">Report</Link>
</nav>
<Routes>
<Route path="/" element={<Interview />} />
<Route path="/report" element={<Report />} />
</Routes>
</BrowserRouter>
);
}
