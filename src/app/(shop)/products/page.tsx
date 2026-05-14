"use client";

import { useState } from "react";
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
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search */}
          <div className="relative mb-4">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                         bg-gray-50 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive =
                cat === "All" ? !selectedCategory : selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(cat === "All" ? undefined : cat)
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                    ${
                      isActive
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-600"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Result count */}
        {!isLoading && !error && (
          <p className="text-sm text-gray-500 mb-4">
            {filtered?.length ?? 0} products found
            {selectedCategory && ` · ${selectedCategory}`}
            {searchQuery && ` · "${searchQuery}"`}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-gray-600">Failed to load products</p>
            <p className="text-sm text-gray-400 mt-1">
              {(error as Error).message}
            </p>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filtered?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-medium text-gray-700">
              No products found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try searching for something else
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(undefined);
              }}
              className="mt-4 text-green-600 text-sm underline"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && filtered && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
