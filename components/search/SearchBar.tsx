"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { Movie } from "@/types/movie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/movies?search=${debouncedSearch}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [debouncedSearch]);

  function handleClick(id: string) {
    setSearch("");
    setResults([]);
    router.push(`/movie/${id}`);
  }

  return (
    <div className="px-6 py-4 border-b border-gray-200 relative">
      <div className="flex items-center gap-2.5 bg-[#f0f0f3] rounded-lg px-4 py-3">
        <AiOutlineSearch size={20} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          className="border-none bg-transparent outline-none text-sm w-full font-[Onest] text-[#1e2227]"
          placeholder="Search for movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {search.trim() && (
        <div className="absolute top-full left-6 right-6 bg-white border border-gray-200 rounded-lg max-h-[400px] overflow-y-auto z-[100] shadow-lg">
          {loading ? (
            <div className="p-5 text-center text-sm text-gray-400">Searching...</div>
          ) : results.length > 0 ? (
            results.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-100"
                onClick={() => handleClick(movie.id)}
              >
                <img
                  src={movie.imageLink}
                  alt={movie.title}
                  className="w-[50px] h-[75px] object-cover rounded"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#1e2227]">{movie.title}</span>
                  <span className="text-xs text-gray-400">{movie.director}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-5 text-center text-sm text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}