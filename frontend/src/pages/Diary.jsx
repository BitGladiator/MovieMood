import { useEffect, useState } from "react";
import { auth, db, collection, query, where, getDocs } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import EntryCard from "../components/EntryCard";
import EntryModal from "../components/EntryModal";

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-6" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Loading Your Diary...
        </h2>
        <p className="mt-2 text-gray-400 text-sm italic">
          Fetching data from the Finder 🎬
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col mt-[20rem]">
        <main className="flex-1 flex items-center justify-center px-4 text-center">
          <p className="text-3xl md:text-4xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 drop-shadow-lg max-w-xl">
            🚀 Welcome, adventurer! Log in to unlock your movie diary universe
          </p>
        </main>
      </div>
    );
  }

  if (entries.length === 0) {
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
  }

  return (
    <>
      <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 ml-10 mr-10">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onClick={setSelectedEntry}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {selectedEntry && (
        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </>
  );
}
