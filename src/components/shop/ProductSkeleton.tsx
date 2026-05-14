export default function ProductSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white animate-pulse">
      <div className="h-32 md:h-40 bg-gray-200" />

      <div className="space-y-2 p-3">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />

        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 rounded bg-gray-200" />
          <div className="h-9 w-9 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
