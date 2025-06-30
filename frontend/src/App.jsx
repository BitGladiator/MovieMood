import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import Stats from "./pages/Stats";
import WatchLater from "./pages/WatchLater";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Finder from "./pages/Finder";
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "linear-gradient(to right, #4f46e5, #9333ea)",
            color: "white",
            borderRadius: "10px",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontWeight: "500",
            marginTop: "2.5rem",
          },
          iconTheme: {
            primary: "#facc15", // yellow
            secondary: "#1f2937", // dark gray
          },
        }}
      />
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/watchlater" element={<WatchLater />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/finder" element={<Finder />} />
        </Routes>
      </div>
    </div>
  );
}
