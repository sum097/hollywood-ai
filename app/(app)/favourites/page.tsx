"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { openModal } from "@/redux/slices/modalSlice";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface FavMovie {
  id: string;
  title: string;
  director: string;
  imageLink: string;
  rating: string;
  subscriptionRequired: boolean;
}

export default function Favourites() {
  const { isLoggedIn, uid } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [movies, setMovies] = useState<FavMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const querySnapshot = await getDocs(
            collection(db, "users", user.uid, "favourites"),
          );
          const favs: FavMovie[] = [];
          querySnapshot.forEach((doc) => {
            favs.push(doc.data() as FavMovie);
          });
          setMovies(favs);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4 animate-pulse">
        <h1 className="text-3xl font-bold text-[#1e2227] mb-8 pb-6 border-b border-gray-200">
          Favourites
        </h1>
        <div className="grid grid-cols-6 max-[1299px]:grid-cols-5 max-[1199px]:grid-cols-4 max-[979px]:grid-cols-3 max-[767px]:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-[240px] bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4">
        <h1 className="text-3xl font-bold text-[#1e2227] mb-8 pb-6 border-b border-gray-200">
          Favourites
        </h1>
        <div className="flex flex-col items-center py-12">
          <h2 className="text-2xl font-bold text-[#1e2227] mb-6">
            Sign in to see your favourites
          </h2>
          <button
            onClick={() => dispatch(openModal("login"))}
            className="bg-[#4b0082] text-white px-10 py-3.5 rounded-lg text-base font-semibold cursor-pointer hover:bg-[#3a006b] transition-colors w-[200px]"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4">
        <h1 className="text-3xl font-bold text-[#1e2227] mb-8 pb-6 border-b border-gray-200">
          Favourites
        </h1>
        <div className="flex flex-col items-center py-12">
          <h2 className="text-xl text-gray-400">
            You haven&apos;t added any favourites yet.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4">
      <h1 className="text-3xl font-bold text-[#1e2227] mb-8 pb-6 border-b border-gray-200">
        Favourites
      </h1>
      <div className="grid grid-cols-6 max-[1299px]:grid-cols-5 max-[1199px]:grid-cols-4 max-[979px]:grid-cols-3 max-[767px]:grid-cols-2 gap-5">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="cursor-pointer transition-all duration-300 hover:scale-[1.03]"
            onClick={() => router.push(`/movie/${movie.id}`)}
          >
            <div className="relative mb-3">
              <img
                src={movie.imageLink}
                alt={movie.title}
                className="w-full h-[240px] object-cover rounded-lg"
              />
            </div>
            <h3 className="text-sm font-bold text-[#1e2227] leading-tight line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{movie.director}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
