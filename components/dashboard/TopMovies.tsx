"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/movie/MovieCard";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import useEmblaCarousel from "embla-carousel-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TopMovies() {
  const [movies, setMovies] = useState<(Movie & { _key: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, subscriptionPlan } = useSelector(
    (state: RootState) => state.user,
  );
  const isSubscribed = isLoggedIn && subscriptionPlan !== "basic";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
    dragThreshold: 3,
  });

  // Scroll wheel support
  useEffect(() => {
    if (!emblaApi) return;
    const root = emblaApi.rootNode();

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const scrollAmount =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      emblaApi!.scrollTo(
        emblaApi!.selectedScrollSnap() + (scrollAmount > 0 ? 3 : -3),
        false,
      );
    }

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [emblaApi]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${API_BASE}/topMovies`);
        const data = await res.json();
        const fetched: Movie[] = Array.isArray(data)
          ? data
          : data.movies || data.data || [];

        // Repeat 4x for a longer scrollable track
        const repeated = [...fetched, ...fetched, ...fetched, ...fetched].map(
          (movie, i) => ({
            ...movie,
            _key: `${movie.id}-${i}`,
          }),
        );

        setMovies(repeated);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const slideClass =
    "flex-none w-1/2 min-[600px]:w-1/3 min-[800px]:w-1/4 min-[1425px]:w-1/5 min-[1435px]:w-1/5 min-[1475px]:w-1/6 px-2.5";

  return (
    <div className="mb-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-[#1e2227] max-[980px]:text-xl">
          Top Movies
        </h2>
        <p className="text-sm text-gray-400 mt-1 max-[980px]:text-xs">
          Enjoy our highest rated films.
        </p>
      </div>
      {loading ? (
        <div className="flex -mx-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={slideClass}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing -mx-2.5"
        >
          <div className="flex">
            {movies.map((movie) => (
              <div key={movie._key} className={slideClass}>
                <div className="max-w-[200px] mx-auto">
                  <MovieCard movie={movie} isSubscribed={isSubscribed} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
