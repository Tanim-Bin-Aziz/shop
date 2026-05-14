"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/shop/ProductCard";
import ProductSkeleton from "@/components/shop/ProductSkeleton";

const CATEGORIES = [
  "All",
  "Rice & Grains",
  "Oil & Ghee",
  "Dairy",
  "Pulses",
  "Eggs",
  "Flour",
  "Sugar & Salt",
  "Vegetables",
  "Spices",
  "Beverages",
  "Noodles & Pasta",
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading, error } = useProducts(selectedCategory);

  const filtered = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur transform-gpu">
        <div className="mx-auto max-w-7xl px-3 py-3">
          {/* SEARCH */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                ✕
              </button>
            )}
          </div>

          {/* CATEGORY (FIXED STABLE SCROLL) */}
          <div className="overflow-x-auto no-scrollbar touch-pan-x">
            <div className="flex flex-nowrap gap-2 min-w-max transform-gpu will-change-transform">
              {CATEGORIES.map((cat) => {
                const isActive =
                  cat === "All" ? !selectedCategory : selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategory(cat === "All" ? undefined : cat)
                    }
                    className={`
                      flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium
                      transition-all active:scale-[0.98]
                      ${
                        isActive
                          ? "bg-green-600 text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-600"
                      }
                    `}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-3 py-4">
        {/* RESULT */}
        {!isLoading && !error && (
          <p className="mb-3 text-xs text-gray-500">
            {filtered?.length ?? 0} products found
          </p>
        )}

        {/* ERROR */}
        {error && (
          <div className="py-16 text-center">
            <p className="text-4xl mb-2">⚠️</p>
            <p className="text-gray-600">Failed to load products</p>
            <p className="text-sm text-gray-400 mt-1">
              {(error as Error).message}
            </p>
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !error && filtered?.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-5xl mb-3">🔍</p>
            <p className="text-base font-medium text-gray-700">
              No products found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try searching something else
            </p>
          </div>
        )}

        {/* PRODUCTS */}
        {!isLoading && filtered && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
