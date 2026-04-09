"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useAudioDuration(audioLink: string | undefined) {
  const [duration, setDuration] = useState<string>("--:--");

  useEffect(() => {
    if (!audioLink) return;

    const audio = new Audio(`${API_BASE}/${audioLink}`);
    audio.addEventListener("loadedmetadata", () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      setDuration(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    });

    return () => {
      audio.src = "";
    };
  }, [audioLink]);

  return duration;
}