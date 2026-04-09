"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { openModal } from "@/redux/slices/modalSlice";
import { Movie } from "@/types/movie";
import { AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";
import {
  BsBookmark,
  BsBookmarkFill,
  BsLightningChargeFill,
  BsMic,
} from "react-icons/bs";
import { FiCalendar } from "react-icons/fi";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MovieDetails() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, subscriptionPlan, uid } = useSelector(
    (state: RootState) => state.user,
  );
  const isSubscribed = isLoggedIn && subscriptionPlan !== "basic";

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`${API_BASE}/movies/${id}`);
        const data = await res.json();
        setMovie(data.data || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    async function checkFavourite() {
      if (!uid || !id) return;
      try {
        const docRef = doc(db, "users", uid, "favourites", id as string);
        const docSnap = await getDoc(docRef);
        setIsFavourited(docSnap.exists());
      } catch (err) {
        console.error(err);
      }
    }
    checkFavourite();
  }, [uid, id]);

  function handleSummarise() {
    if (!isLoggedIn) {
      dispatch(openModal("login"));
      return;
    }
    if (movie?.subscriptionRequired && !isSubscribed) {
      router.push("/plans");
      return;
    }
    router.push(`/player/${id}`);
  }

  async function handleFavourite() {
    if (!isLoggedIn || !uid) {
      dispatch(openModal("login"));
      return;
    }
    const docRef = doc(db, "users", uid, "favourites", id as string);
    try {
      if (isFavourited) {
        await deleteDoc(docRef);
        setIsFavourited(false);
      } else {
        await setDoc(docRef, {
          id: movie?.id,
          title: movie?.title,
          director: movie?.director,
          imageLink: movie?.imageLink,
          rating: movie?.rating,
          subscriptionRequired: movie?.subscriptionRequired,
        });
        setIsFavourited(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1200px] min-[1450px]:mx-auto px-8 py-8 max-[980px]:px-4">
        <div className="flex gap-10 max-[768px]:flex-col animate-pulse">
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-[250px] mb-4" />
            <div className="h-4 bg-gray-200 rounded w-[140px] mb-2" />
            <div className="h-4 bg-gray-200 rounded w-[180px] mb-6" />

            <div className="border-y border-gray-200 py-4 mb-6">
              <div className="grid grid-cols-2 gap-y-3 gap-x-10 w-fit">
                <div className="h-4 bg-gray-200 rounded w-[80px]" />
                <div className="h-4 bg-gray-200 rounded w-[80px]" />
                <div className="h-4 bg-gray-200 rounded w-[80px]" />
                <div className="h-4 bg-gray-200 rounded w-[80px]" />
              </div>
            </div>

            <div className="h-12 bg-gray-200 rounded-lg w-[280px] mb-4" />
            <div className="h-5 bg-gray-200 rounded w-[180px] mb-8" />

            <div className="h-5 bg-gray-200 rounded w-[140px] mb-4" />
            <div className="flex gap-3 mb-6">
              <div className="h-10 bg-gray-200 rounded-md w-[90px]" />
              <div className="h-10 bg-gray-200 rounded-md w-[110px]" />
              <div className="h-10 bg-gray-200 rounded-md w-[90px]" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="w-[220px] max-[768px]:w-full flex-shrink-0">
            <div className="h-[330px] bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-[1200px] min-[1450px]:mx-auto px-8 py-8">
        <p>Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] min-[1450px]:mx-auto px-8 py-8 max-[980px]:px-4">
      <div className="flex gap-10 max-[768px]:flex-col">
        {/* Left side - Details */}
        <div className="flex-1">
          <h1 className="text-[38px] font-bold text-[#1e2227] mb-1">
            {movie.title}
          </h1>
          <p className="text-base text-gray-400 mb-6">{movie.director}</p>

          <div className="border-y border-gray-200 py-4 mb-6">
            <div className="grid grid-cols-2 gap-y-3 gap-x-10 w-fit text-sm text-[#1e2227] font-medium">
              <span className="flex items-center gap-2">
                <AiOutlineStar size={16} />
                {movie.rating} / 10
              </span>
              <span className="flex items-center gap-2">
                <AiOutlineClockCircle size={16} />
                --:--
              </span>
              <span className="flex items-center gap-2">
                <BsMic size={16} />
                {movie.type}
              </span>
              <span className="flex items-center gap-2">
                <FiCalendar size={16} />
                {movie.releaseYear}
              </span>
            </div>
          </div>

          <button
            onClick={handleSummarise}
            className="bg-[#4b0082] text-white px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer hover:bg-[#3a006b] transition-colors mb-4 flex items-center gap-2 w-[280px] justify-center"
          >
            Summarise <BsLightningChargeFill size={16} />
          </button>

          <button
            onClick={handleFavourite}
            className="flex items-center gap-2 text-lg font-bold text-[#4b6bfb] cursor-pointer hover:text-[#3451d1] transition-colors bg-transparent border-none mb-4"
          >
            {isFavourited ? (
              <BsBookmarkFill size={16} />
            ) : (
              <BsBookmark size={16} />
            )}
            {isFavourited ? "Remove from Favourites" : "Add to Favourites"}
          </button>

          <div className="pt-6">
            <h3 className="text-lg font-bold text-[#1e2227] mb-4">
              What&apos;s it about?
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {movie.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#f0f0f0] text-[#1e2227] text-md font-semibold px-5 py-4 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[15px] text-[#1e2227] leading-6 font-medium">
              {movie.movieDescription}
            </p>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-[220px] max-[768px]:w-full">
          <img
            src={movie.imageLink}
            alt={movie.title}
            className="w-full h-auto rounded-lg sticky top-8"
          />
        </div>
      </div>
    </div>
  );
}
