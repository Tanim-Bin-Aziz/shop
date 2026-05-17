"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { createClient } from "@/lib/supabase/client";

interface FormData {
  full_name: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  payment_method: "cod" | "bkash" | "nagad";
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    full_name: "",
    phone: "",
    address: "",
    area: "",
    city: "Ishwardi",
    payment_method: "cod",
    notes: "",
  });

  const delivery = totalPrice() >= 500 ? 0 : 60;
  const grandTotal = totalPrice() + delivery;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=/checkout");
        return;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: grandTotal,
          status: "pending",
          shipping_address: `${form.address}, ${form.area}, ${form.city}`,
          phone: form.phone,
          full_name: form.full_name,
          payment_method: form.payment_method,
          notes: form.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;
      const stockUpdates = items.map((item) =>
        supabase.rpc("decrement_stock", {
          p_id: item.id,
          qty: item.quantity,
        }),
      );

      const stockResults = await Promise.all(stockUpdates);
      const stockError = stockResults.find((r) => r.error)?.error;
      if (stockError) throw stockError;
      clearCart();
      router.push(`/order-success?id=${order.id}`);
    } catch (err) {
      setError(
        (err as Error).message ||
          "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/products" className="text-green-600 underline">
            View Products
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
          <Link href="/cart" className="text-gray-400 hover:text-gray-600">
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
          <h1 className="text-xl font-bold text-gray-800">Check Out</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Delivery information
                </h2>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        full name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        mobile number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="01XXXXXXXXX"
                        pattern="01[3-9]\d{8}"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      full address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="House No., Road No., Area"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Area / Locality
                      </label>
                      <input
                        type="text"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Bazar, Ishwardi city"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        City
                      </label>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                                   bg-white"
                      >
                        {["Ishwardi"].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="e.g. Leave at the gate, deliver in the evening..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Payment method
                </h2>

                <div className="space-y-2">
                  {[
                    {
                      value: "cod",
                      label: "Cash on Delivery",
                      icon: "💵",
                      desc: "Pay when you receive the product",
                    },
                    {
                      value: "bkash",
                      label: "bKash",
                      icon: "📱",
                      desc: "Pay via bKash",
                    },
                    {
                      value: "nagad",
                      label: "Nagad",
                      icon: "💳",
                      desc: "Pay via Nagad",
                    },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                        ${
                          form.payment_method === method.value
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={form.payment_method === method.value}
                        onChange={handleChange}
                        className="accent-green-600"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {method.label}
                        </p>
                        <p className="text-xs text-gray-400">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                <h2 className="font-bold text-gray-800 mb-4">Your Order</h2>

                {/* Items */}
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-800 flex-shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{totalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span
                      className={
                        delivery === 0 ? "text-green-600 font-medium" : ""
                      }
                    >
                      {delivery === 0 ? "Free" : `৳${delivery}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-green-700 text-lg">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-green-600 text-white py-3.5 rounded-xl font-semibold
                             hover:bg-green-700 active:scale-[0.98] transition-all text-sm
                             disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Placing order...
                    </>
                  ) : (
                    "Confirm Order ✓"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
