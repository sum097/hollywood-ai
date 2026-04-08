import SelectedMovies from "@/components/dashboard/SelectedMovies";
import TopMovies from "@/components/dashboard/TopMovies";

export default function Dashboard() {
  return (
    <div className="py-6">
      <div className="mb-6 pb-6 border-b border-gray-200 px-8">
        <h1 className="text-3xl font-bold text-[#1e2227] mb-2">AI Movie Summariser</h1>
        <p className="text-base text-gray-400">
          Enjoy high-quality summaries of your favourite movies instantly without breaking a sweat.
        </p>
      </div>
      <div className="px-8">
        <SelectedMovies />
        <TopMovies />
      </div>
    </div>
  );
}