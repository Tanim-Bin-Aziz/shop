"use client";
// src/components/shop/ProductDetails.tsx

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Package,
  Star,
  Tag,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ProductDetails({ product }: { product: Product }) {
  const { items, addItem } = useCartStore();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image_url);

  const isOutOfStock = product.stock <= 0;

  const existingCartItem = items.find((i) => i.id === product.id);
  const alreadyInCartQty = existingCartItem?.quantity ?? 0;

  const remainingAddable = product.stock - alreadyInCartQty;

  const handleDecrease = () => setQty((q) => Math.max(1, q - 1));

  const handleIncrease = () => {
    if (qty >= remainingAddable) {
      toast.warning("Stock limit reached", {
        description: `Only ${remainingAddable} more can be added (${alreadyInCartQty} already in cart)`,
      });
      return;
    }
    setQty((q) => q + 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Out of Stock", {
        description: "This product is currently unavailable.",
      });
      return;
    }

    if (remainingAddable <= 0) {
      toast.error("Cart limit reached", {
        description: `You already have all ${product.stock} units in your cart.`,
      });
      return;
    }

    if (qty > remainingAddable) {
      toast.warning("Quantity adjusted", {
        description: `Only ${remainingAddable} more can be added.`,
      });
      setQty(remainingAddable);
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      image: product.image_url,
      category: product.category,
      stock: product.stock,
      quantity: qty,
    });

    toast.success(alreadyInCartQty > 0 ? "Cart updated!" : "Added to cart!", {
      description: `${product.name} × ${qty}`,
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });

    setQty(1);
  };

  const stockStatus = () => {
    if (isOutOfStock)
      return {
        label: "Out of Stock",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
      };
    if (product.stock <= 5)
      return {
        label: `Only ${product.stock} left!`,
        color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      };
    return {
      label: "In Stock",
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    };
  };

  const { label: stockLabel, color: stockColor } = stockStatus();

  return (
    <div className="min-h-screen bg-white/60 py-6 md:py-10 px-3 md:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start"
        >
          {/* ─── IMAGE SECTION ─── */}
          <div className="space-y-3">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative h-[240px] sm:h-[320px] md:h-[440px] rounded-2xl overflow-hidden
                         bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl"
            >
              <Image
                src={selectedImage || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Stock badge on image */}
              <div className="absolute top-3 left-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-md ${stockColor}`}
                >
                  {stockLabel}
                </span>
              </div>
            </motion.div>
          </div>

          {/* ─── INFO SECTION ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl
                       p-4 sm:p-5 md:p-6 shadow-2xl space-y-5"
          >
            {/* Category badge */}
            <div className="flex items-center gap-1">
              <Tag size={13} className="text-slate-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                {product.category}
              </span>
            </div>

            {/* Name */}
            <div className="flex justify-between">
              <h1 className="text-xl md:text-3xl font-bold text-black/70 leading-tight">
                {product.name}
              </h1>{" "}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={
                      s <= 4
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-600"
                    }
                  />
                ))}
                <span className="text-xs text-slate-400 ml-1">(4.0)</span>
              </div>
            </div>
            {/* Price */}
            <div className="flex items-end gap-3">
              {" "}
              price
              <span className="text-2xl md:text-3xl font-extrabold text-green-400">
                ৳{product.price.toLocaleString()}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-black/60 text-sm leading-relaxed border-t border-white/10 pt-4">
                {product.description}
              </p>
            )}

            {/* Stock info */}
            <div className="flex items-center gap-2 text-sm">
              <Package size={15} className="text-black/60" />
              <span className="text-black/60">
                {isOutOfStock
                  ? "Currently unavailable"
                  : `${product.stock} units available`}
                {alreadyInCartQty > 0 && (
                  <span className="ml-2 text-amber-400 font-medium">
                    ({alreadyInCartQty} in cart)
                  </span>
                )}
              </span>
            </div>

            {/* ─── QUANTITY SELECTOR ─── */}
            <div className="space-y-2 pt-1">
              <label className="text-xs text-black/60 uppercase tracking-wider font-medium">
                Quantity
              </label>

              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDecrease}
                  disabled={qty <= 1}
                  className="w-9 h-9 rounded-lg border border-white/15 bg-white/5 text-black
                             flex items-center justify-center disabled:opacity-30 transition
                             hover:bg-white/10 active:scale-95"
                >
                  <Minus size={14} />
                </motion.button>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={qty}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="min-w-[44px] text-center text-xl font-bold text-black/80"
                  >
                    {qty}
                  </motion.span>
                </AnimatePresence>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleIncrease}
                  disabled={qty >= remainingAddable || isOutOfStock}
                  className="w-9 h-9 rounded-lg border border-white/15 bg-white/5 text-black
                             flex items-center justify-center disabled:opacity-30 transition
                             hover:bg-white/10 active:scale-95"
                >
                  <Plus size={14} />
                </motion.button>

                <span className="text-xs text-black/60 ml-1">
                  max {remainingAddable > 0 ? remainingAddable : 0}
                </span>
              </div>
            </div>

            {/* Already in cart notice */}
            <AnimatePresence>
              {alreadyInCartQty > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20
                             rounded-xl px-3 py-2.5 text-sm text-blue-300"
                >
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>
                    {alreadyInCartQty} unit{alreadyInCartQty > 1 ? "s" : ""}{" "}
                    already in your cart
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Out of stock notice */}
            <AnimatePresence>
              {isOutOfStock && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20
                             rounded-xl px-3 py-2.5 text-sm text-red-400"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  This product is out of stock. Check back soon.
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── ADD TO CART BUTTON ─── */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || remainingAddable <= 0}
                className={`w-full h-12 text-base font-semibold rounded-xl transition-all duration-200
                  ${
                    isOutOfStock || remainingAddable <= 0
                      ? "bg-white/10 text-slate-500 cursor-not-allowed border border-white/10"
                      : "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/25 hover:shadow-green-400/30"
                  }`}
              >
                <ShoppingCart size={17} className="mr-2" />
                {isOutOfStock
                  ? "Out of Stock"
                  : remainingAddable <= 0
                    ? "Cart Full (Stock Limit)"
                    : alreadyInCartQty > 0
                      ? "Add More to Cart"
                      : "Add to Cart"}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
