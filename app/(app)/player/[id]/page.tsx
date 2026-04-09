"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Movie } from "@/types/movie";
import { IoPlayBack, IoPlay, IoPause, IoPlayForward } from "react-icons/io5";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Player() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleTimeUpdate() {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function handleSkipBack() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 10,
    );
  }

  function handleSkipForward() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      duration,
      audioRef.current.currentTime + 10,
    );
  }

  function handleEnded() {
    setIsPlaying(false);
    setCurrentTime(0);
  }

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#4b0082] rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8">
        <p>Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4 pb-[140px]">
      <h1 className="text-2xl font-bold text-[#1e2227] mb-6 pb-6 border-b border-gray-200">
        {movie.title}
      </h1>
      <p
        className="text-[15px] text-[#1e2227] leading-7 font-medium"
        style={{ whiteSpace: "pre-line" }}
      >
        {movie.summary}
      </p>

      {/* Audio Player */}
      <audio
        ref={audioRef}
        src={`${API_BASE}/${movie.audioLink}`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="fixed bottom-0 left-0 right-0 bg-[#042330] text-white z-[50]">
        <div className="px-8 max-[768px]:px-4">
          {/* Desktop layout */}
          <div className="flex items-center py-3 max-[768px]:hidden">
            {/* Movie info - left */}
            <div className="flex items-center gap-3 w-[250px]">
              <img
                src={movie.imageLink}
                alt={movie.title}
                className="w-10 h-14 rounded object-cover"
              />
              <div>
                <p className="text-[16px] font-semibold">{movie.title}</p>
                <p className="text-[14px] text-gray-400">{movie.director}</p>
              </div>
            </div>

            {/* Controls - center */}
            <div className="flex items-center justify-center gap-5 flex-1 min-[1350px]:ml-60">
              <button
                onClick={handleSkipBack}
                className="cursor-pointer bg-transparent border-none text-white hover:text-gray-300 transition-colors"
              >
                <IoPlayBack size={22} />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white text-[#1e2227] flex items-center justify-center cursor-pointer border-none hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <IoPause size={20} />
                ) : (
                  <IoPlay size={20} className="ml-0.5" />
                )}
              </button>
              <button
                onClick={handleSkipForward}
                className="cursor-pointer bg-transparent border-none text-white hover:text-gray-300 transition-colors"
              >
                <IoPlayForward size={22} />
              </button>
            </div>

            {/* Progress bar - right */}
            <div className="flex items-center gap-3 w-[480px] mr-8">
              <span className="text-md text-white w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-0.5 cursor-pointer"
              />
              <span className="text-md text-white w-[100px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="hidden max-[768px]:flex flex-col items-center py-4 gap-3">
            {/* Movie info */}
            <div className="flex items-center gap-3">
              <img
                src={movie.imageLink}
                alt={movie.title}
                className="w-10 h-14 rounded object-cover"
              />
              <div>
                <p className="text-[15px] font-semibold">{movie.title}</p>
                <p className="text-[13px] text-gray-400">{movie.director}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-5">
              <button
                onClick={handleSkipBack}
                className="cursor-pointer bg-transparent border-none text-white hover:text-gray-300 transition-colors"
              >
                <IoPlayBack size={22} />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white text-[#1e2227] flex items-center justify-center cursor-pointer border-none hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <IoPause size={20} />
                ) : (
                  <IoPlay size={20} className="ml-0.5" />
                )}
              </button>
              <button
                onClick={handleSkipForward}
                className="cursor-pointer bg-transparent border-none text-white hover:text-gray-300 transition-colors"
              >
                <IoPlayForward size={22} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 w-full px-4">
              <span className="text-sm text-white w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-0.5 cursor-pointer"
              />
              <span className="text-sm text-white w-[40px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
