export default function SkeletonCard() {
  return (
    <div className="w-[180px] flex-shrink-0 animate-pulse">
      <div className="w-full h-[270px] bg-gray-200 rounded-lg mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  );
}