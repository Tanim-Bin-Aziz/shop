"use client";

import Image from "next/image";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { ShoppingCart, Check, PackageOpen, Tag } from "lucide-react";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    addItem({
      ...product,
      image: product.image_url || "/placeholder.png",
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="
        w-full
        flex flex-col
        overflow-hidden
        rounded-xl
        border border-gray-200
        bg-white
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-md
      "
    >
      {/* IMAGE */}
      <div className="relative h-36 md:h-44 w-full shrink-0 overflow-hidden bg-gray-100">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />

        {/* LOW STOCK */}
        {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute left-2 top-2">
            <div className="flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-medium text-white">
              <PackageOpen size={10} />
              {product.stock} left
            </div>
          </div>
        )}

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-3">
        {/* CATEGORY */}
        <div className="mb-1 flex items-center gap-1 text-[11px] text-gray-500">
          <Tag size={12} />
          <span className="truncate">{product.category}</span>
        </div>

        {/* NAME */}
        <h3 className="line-clamp-2 min-h-[38px] text-sm font-semibold text-gray-800">
          {product.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-1 line-clamp-1 text-xs text-gray-500">
          {product.description}
        </p>

        {/* PRICE + BUTTON */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-base font-bold text-green-700">
            ৳{product.price.toLocaleString("bn-BD")}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`
              flex h-8 w-8 items-center justify-center
              rounded-lg transition-all duration-300
              ${
                added
                  ? "bg-green-500 text-white"
                  : isOutOfStock
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-green-600 text-white hover:bg-green-700"
              }
            `}
          >
            {added ? (
              <Check size={14} strokeWidth={3} />
            ) : (
              <ShoppingCart size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
