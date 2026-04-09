export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[300px] max-[1199px]:h-[260px] max-[980px]:h-[220px] bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  );
}