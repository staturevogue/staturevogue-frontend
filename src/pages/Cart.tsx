import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
        <ShoppingBag className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mb-4 sm:mb-6" />
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F2B5B] mb-3 sm:mb-4 text-center">Your cart is empty</h2>
        <Link to="/products" className="bg-[#1F2B5B] text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#283747] transition text-sm sm:text-base">
          Continue Shopping <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-0">
          <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-[#1F2B5B]">Secure Checkout</h1>
          <Link to="/products" className="text-xs sm:text-sm text-[#1F2B5B] underline hover:no-underline">Continue Shopping</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* LEFT: Shipping & Payment */}
          <div className="order-2 lg:order-1 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Contact */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#1F2B5B] mb-2 sm:mb-3 lg:mb-4">Contact Information</h2>
              <input 
                type="email" 
                placeholder="Email or mobile phone number"
                className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1F2B5B] outline-none text-sm"
              />
            </div>

            {/* Delivery */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#1F2B5B] mb-2 sm:mb-3 lg:mb-4">Delivery Address</h2>
              <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                <input type="text" placeholder="Country/Region" className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg text-sm" defaultValue="India" />
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:gap-3">
                  <input type="text" placeholder="First name" className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg text-sm" />
                  <input type="text" placeholder="Last name" className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg text-sm" />
                </div>
                <input type="text" placeholder="Address" className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg text-sm" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3">
                  <input type="text" placeholder="City" className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg text-sm" />
                  <input type="text" placeholder="State" className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg text-sm" />
                  <input type="text" placeholder="PIN code" className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg text-sm" />
                </div>
                <input type="text" placeholder="Phone" className="w-full p-2 sm:p-2.5 lg:p-3 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#1F2B5B] mb-2 sm:mb-3 lg:mb-4">Payment</h2>
              <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 lg:mb-4">All transactions are secure and encrypted.</div>
              <div className="border border-gray-300 rounded-lg bg-gray-50 p-2 sm:p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <span className="font-medium text-sm sm:text-base text-gray-900">Razorpay Secure (UPI, Cards, Wallets)</span>
                <div className="flex gap-1 sm:gap-2">
                  <div className="w-7 h-4 sm:w-8 sm:h-5 bg-white border rounded"></div>
                  <div className="w-7 h-4 sm:w-8 sm:h-5 bg-white border rounded"></div>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#1F2B5B] text-white py-3 sm:py-3.5 lg:py-4 rounded-lg font-bold text-sm sm:text-base hover:bg-[#283747] transition shadow-lg">
              Pay Now ₹{total.toLocaleString()}
            </button>
          </div>

          {/* RIGHT: Cart Items - FIXED MOBILE LAYOUT */}
          <div className="order-1 lg:order-2">
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4 sm:top-24">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#1F2B5B] mb-3 sm:mb-4 lg:mb-6">
                Order Summary ({cartItems.length} items)
              </h2>
              
              <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 -mr-2 sm:-mr-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-3 p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-cover rounded-lg border" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm lg:text-base text-gray-900 truncate">{item.name}</h3>
                        <p className="text-xs lg:text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1 flex-shrink-0">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-2 py-1 text-xs sm:text-sm font-semibold min-w-[36px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-sm lg:text-base font-semibold text-right min-w-[60px] sm:min-w-[70px]">
                        ₹{item.price * item.quantity}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 rounded transition-all flex-shrink-0"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 sm:space-y-3 border-t border-gray-200 pt-3 sm:pt-4 lg:pt-6">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-base sm:text-lg lg:text-xl font-bold text-[#1F2B5B] py-2 sm:py-3 lg:py-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
