// Diary.jsx
import { useEffect, useState } from "react";
import { auth, db, collection, query, where, getDocs } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "react-hot-toast";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "diary"),
          where("uid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(results);
      } catch (err) {
        console.error("Failed to fetch diary entries:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "diary", id));
      setEntries(entries.filter((entry) => entry.id !== id));
      toast.success("Entry deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete entry.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lime-400 font-semibold text-lg animate-pulse">
            Loading your diary...
          </p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col mt-[20rem]">
        <main className="flex-1 flex items-center justify-center px-4 text-center">
          <p className="text-3xl md:text-4xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 drop-shadow-lg max-w-xl">
            🚀 Welcome, adventurer! Log in to unlock your movie diary universe
          </p>
        </main>
      </div>
    );

  if (entries.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 flex flex-col items-center justify-center p-8">
      <div className="text-7xl animate-bounce mb-4">🎯</div>
      <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-lime-400 bg-clip-text text-transparent mb-3">
        No Movies in Your Diary
      </h2>
      <p className="text-lg text-gray-400 text-center max-w-md">
        Browse and add movies 
      </p>
    </div>
  );

  return (
    <>
      <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 ml-10 mr-10">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="cursor-pointer"
          >
            <Card
              className="flex flex-col justify-between rounded-3xl bg-white/10 backdrop-blur-lg border border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.3)]"
            >
              <CardContent className="p-5 flex flex-col h-full">
                <img
                  src={entry.Poster}
                  alt={entry.Title}
                  className="w-full h-60 object-cover rounded-xl mb-4 border border-gray-600 shadow-md transition-transform duration-200 hover:scale-[1.02]"
                />
                <div className="flex-grow">
                  <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-400 to-cyan-500 drop-shadow mb-1">
                    {entry.Title}
                  </h3>
                  <p className="text-sm text-gray-300 italic tracking-wide mb-3">
                    🎬 {entry.Year}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="cursor-pointer mt-auto w-full py-2.5 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-red-500 hover:brightness-110 text-white font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                >
                  🗑️ Delete Entry
                </button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
          <div className="bg-gray-900 text-white rounded-2xl p-6 max-w-3xl w-full flex flex-col md:flex-row gap-6 border border-gray-700 shadow-2xl">
            <div className="flex-shrink-0 hidden md:block">
              <img
                src={selectedEntry.Poster}
                alt={selectedEntry.title}
                className="w-40 h-60 object-cover rounded-xl border border-gray-700"
              />
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-lime-400">
                {selectedEntry.Title}
              </h2>
              <p className="text-gray-400 italic">📅 {selectedEntry.Year}</p>
              <p className="text-sm text-gray-300">
                <strong> Genre:</strong> {selectedEntry.Genre}
              </p>
              <p className="text-sm text-gray-300">
                <strong> Director:</strong> {selectedEntry.Director}
              </p>
              <p className="text-sm text-gray-300">
                <strong> Actors:</strong> {selectedEntry.Actors}
              </p>
              <p className="text-sm text-gray-300">
                <strong> Runtime:</strong> {selectedEntry.Runtime}
              </p>
              <p className="text-sm text-gray-300">
                <strong> IMDb Rating:</strong> {selectedEntry.IMDbRating}
              </p>
              <div className="h-[10rem] overflow-y-scroll border border-lime-400 rounded-xl p-4 bg-black/30 shadow-inner shadow-lime-500/30 relative scroll-smooth hover:shadow-lime-300/50 transition-all duration-300">
                <p className="text-sm text-lime-100 whitespace-pre-line tracking-wide leading-relaxed">
                  {selectedEntry.Plot || "No plot available."}
                </p>
              </div>
              <p className="text-sm">
                Mood: <span className="italic">{selectedEntry.mood}</span>
              </p>
              <div className="text-right pt-2">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
