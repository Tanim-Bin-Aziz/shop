"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const shortId = orderId?.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success animation */}
        <div
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6
                        animate-bounce"
        >
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          অর্ডার সফল হয়েছে! 🎉
        </h1>
        <p className="text-gray-500 mb-6">
          আপনার অর্ডার গ্রহণ করা হয়েছে। শীঘ্রই ডেলিভারি দেওয়া হবে।
        </p>

        {shortId && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <p className="text-xs text-gray-400 mb-1">অর্ডার নম্বর</p>
            <p className="text-2xl font-bold text-green-700 tracking-widest">
              #{shortId}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              এই নম্বরটি সেভ করে রাখুন
            </p>
          </div>
        )}

        <div className="bg-green-50 rounded-xl p-4 mb-6 text-sm text-green-700 text-left space-y-2">
          <p className="flex items-center gap-2">
            <span>📦</span> পণ্য প্রস্তুত হচ্ছে
          </p>
          <p className="flex items-center gap-2">
            <span>🚚</span> ১-৩ কার্যদিবসের মধ্যে ডেলিভারি
          </p>
          <p className="flex items-center gap-2">
            <span>📞</span> ডেলিভারির আগে ফোন করা হবে
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold
                       hover:bg-green-700 transition-colors text-sm"
          >
            আরও কেনাকাটা করুন
          </Link>
          <Link
            href="/orders"
            className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-semibold
                       border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            আমার অর্ডার দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          লোড হচ্ছে...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
