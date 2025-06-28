import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import Stats from "./pages/Stats";
import WatchLater from "./pages/WatchLater";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/watchlater" element={<WatchLater />} />
        </Routes>
      </div>
    </div>
  );
}
