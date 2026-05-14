"use client";

import Image from "next/image";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      ...product,
      image: product.image_url || "/placeholder.png",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden
                    hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded-full">
              স্টক নেই
            </span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute top-2 left-2">
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
              মাত্র {product.stock}টি বাকি
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Category */}
        <p className="text-xs text-gray-400 mb-1 truncate">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-1 mb-3">
          {product.description}
        </p>

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-bold text-green-700">
            ৳{product.price.toLocaleString("bn-BD")}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        text-white text-sm font-bold transition-all duration-200
                        ${
                          added
                            ? "bg-green-500 scale-95"
                            : isOutOfStock
                              ? "bg-gray-200 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 active:scale-95"
                        }`}
            aria-label="কার্টে যোগ করুন"
          >
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
