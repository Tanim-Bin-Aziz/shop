"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();
  const router = useRouter();

  const delivery = totalPrice() >= 500 ? 0 : 60;
  const grandTotal = totalPrice() + delivery;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-7xl mb-6">🛒</p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            The cart is empty
          </h2>
          <p className="text-gray-500 mb-8">Add some products to your cart</p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl
                       font-semibold hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/products"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            আমার কার্ট <span className="text-green-600">({totalItems()})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {/* Free delivery banner */}
            {totalPrice() < 500 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
                ৳{(500 - totalPrice()).toFixed(0)} বেশি কিনলে{" "}
                <strong>ফ্রি ডেলিভারি</strong> পাবেন!
              </div>
            )}
            {totalPrice() >= 500 && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                🎉 আপনি <strong>ফ্রি ডেলিভারি</strong> পাচ্ছেন!
              </div>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center"
              >
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                  <Image
                    src={item.image_url || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">
                    {item.category}
                  </p>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-green-700 font-bold text-base">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400">
                      ৳{item.price} × {item.quantity}
                    </p>
                  )}
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="সরিয়ে দিন"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-100 px-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500
                                 hover:text-gray-800 font-bold text-lg transition-colors"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 flex items-center justify-center text-gray-500
                                 hover:text-gray-800 font-bold text-lg transition-colors
                                 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h2 className="font-bold text-gray-800 text-lg mb-4">
                অর্ডার সারসংক্ষেপ
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>সাবটোটাল ({totalItems()} পণ্য)</span>
                  <span className="font-medium text-gray-800">
                    ৳{totalPrice().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span
                    className={`font-medium ${delivery === 0 ? "text-green-600" : "text-gray-800"}`}
                  >
                    {delivery === 0 ? "ফ্রি" : `৳${delivery}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-800">মোট</span>
                  <span className="font-bold text-green-700 text-lg">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full mt-5 bg-green-600 text-white py-3.5 rounded-xl font-semibold
                           hover:bg-green-700 active:scale-[0.98] transition-all text-sm"
              >
                চেকআউট করুন →
              </button>

              <Link
                href="/products"
                className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors"
              >
                কেনাকাটা চালিয়ে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
