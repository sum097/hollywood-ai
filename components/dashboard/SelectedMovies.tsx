"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/movie/MovieCard";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import useEmblaCarousel from "embla-carousel-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SelectedMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, subscriptionPlan } = useSelector(
    (state: RootState) => state.user,
  );
  const isSubscribed = isLoggedIn && subscriptionPlan !== "basic";

  const [emblaRef] = useEmblaCarousel({
    active: false,
  });

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${API_BASE}/selectedMovies`);
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : data.movies || data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className="mb-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-[#1e2227] max-[980px]:text-xl">Selected just for you</h2>
        <p className="text-sm text-gray-400 mt-1 max-[980px]:text-xs">We think you&apos;ll like these.</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-6 max-[1299px]:grid-cols-5 max-[1199px]:grid-cols-4 max-[979px]:grid-cols-3 max-[767px]:grid-cols-2 gap-x-5 gap-y-0 overflow-hidden" style={{ gridTemplateRows: "1fr", gridAutoRows: "0" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div ref={emblaRef}>
          <div className="grid grid-cols-6 max-[1299px]:grid-cols-5 max-[1199px]:grid-cols-4 max-[979px]:grid-cols-3 max-[767px]:grid-cols-2 gap-x-5 gap-y-0 overflow-hidden" style={{ gridTemplateRows: "1fr", gridAutoRows: "0" }}>
            {movies.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} isSubscribed={isSubscribed} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}