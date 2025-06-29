import React, { useEffect, useState } from "react";
import { auth, logout, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [diaryCount, setDiaryCount] = useState(0);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "Movie Fan",
          email: currentUser.email,
          uid: currentUser.uid,
          avatar:
            currentUser.photoURL ||
            "https://img.icons8.com/fluency-systems-filled/96/user-male-circle.png",
        });

        // Fetch diary entries count
        const diaryQuery = query(
          collection(db, "diary"),
          where("uid", "==", currentUser.uid)
        );
        const diarySnapshot = await getDocs(diaryQuery);
        setDiaryCount(diarySnapshot.size);

        // Fetch watch later entries count
        const watchQuery = query(
          collection(db, "watchlater"),
          where("uid", "==", currentUser.uid)
        );
        const watchSnapshot = await getDocs(watchQuery);
        setWatchLaterCount(watchSnapshot.size);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl p-8">
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-600 shadow-md"
          />
          <h2 className="text-2xl font-bold text-indigo-300">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-indigo-800/40 p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-indigo-200">🎬 Diary Stats</h3>
            <p className="text-gray-300 text-sm mt-1">
              You’ve logged <span className="font-semibold text-indigo-100">{diaryCount}</span> movie{diaryCount !== 1 && "s"}.
            </p>
          </div>

          <div className="bg-yellow-700/40 p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-yellow-200">⭐ Watch Later</h3>
            <p className="text-gray-300 text-sm mt-1">
              <span className="font-semibold text-yellow-100">{watchLaterCount}</span> movie{watchLaterCount !== 1 && "s"} saved for later.
            </p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-all shadow-lg"
            >
              🔓 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
