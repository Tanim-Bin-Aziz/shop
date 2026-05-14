export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
