import SelectedMovies from "@/components/dashboard/SelectedMovies";
import TopMovies from "@/components/dashboard/TopMovies";

export default function Dashboard() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="px-8 py-6 max-[980px]:px-4 max-[980px]:py-4">
        <h1 className="text-3xl max-[980px]:text-2xl font-bold text-[#1e2227] mb-2">AI Movie Summariser</h1>
        <p className="text-base max-[980px]:text-sm text-gray-400">
          Enjoy high-quality summaries of your favourite movies instantly without breaking a sweat.
        </p>
      </div>
      <hr className="border-gray-200" />
      <div className="px-8 py-6 max-[980px]:px-4 max-[980px]:py-4">
        <SelectedMovies />
        <TopMovies />
      </div>
    </div>
  );
}