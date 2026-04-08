"use client";

import { Movie } from "@/types/movie";
import { useRouter } from "next/navigation";
import { AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";

interface MovieCardProps {
  movie: Movie;
  isSubscribed?: boolean;
}

export default function MovieCard({
  movie,
  isSubscribed = false,
}: MovieCardProps) {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer transition-all duration-300 hover:scale-[1.03] w-[200px] flex-shrink-0"
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      <div className="relative mb-3">
        <img
          src={movie.imageLink}
          alt={movie.title}
          className="w-full h-[300px] object-cover rounded-lg"
        />
        {movie.subscriptionRequired && !isSubscribed && (
          <span className="absolute top-2 right-2 bg-[#2b2d42] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            Premium
          </span>
        )}
      </div>
      <h3 className="text-sm font-bold text-[#1e2227] leading-tight line-clamp-2">
        {movie.title}
      </h3>
      <p className="text-xs text-gray-400 mt-1">{movie.director}</p>
      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <AiOutlineClockCircle size={13} />
          --:--
        </span>
        <span className="flex items-center gap-1">
          <AiOutlineStar size={13} />
          {movie.rating}
        </span>
      </div>
    </div>
  );
}
