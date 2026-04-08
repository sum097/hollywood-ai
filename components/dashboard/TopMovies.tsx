"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/movie/MovieCard";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TopMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, subscriptionPlan } = useSelector((state: RootState) => state.user);
  const isSubscribed = isLoggedIn && subscriptionPlan !== "basic";

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${API_BASE}/topMovies`);
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
        <h2 className="text-2xl font-bold text-[#1e2227]">Top Movies</h2>
        <p className="text-sm text-gray-400 mt-1">Enjoy our highest rated films.</p>
      </div>
      {loading ? (
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView="auto"
          className="pb-4"
        >
          {movies.slice(0, 6).map((movie) => (
            <SwiperSlide key={movie.id} style={{ width: "200px" }}>
              <MovieCard movie={movie} isSubscribed={isSubscribed} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}