import SkeletonCard from '@/components/SkeletonCard';

export default function BrowseLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-4">
        <div className="h-9 bg-gray-200 rounded w-56 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-72 mt-2 animate-pulse" />
      </div>
      <div className="mb-8 h-12 bg-gray-100 rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
