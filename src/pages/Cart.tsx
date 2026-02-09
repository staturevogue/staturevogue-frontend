import { Link } from "react-router-dom";
import { Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; //

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const navigate = useNavigate();
  const handleCheckout = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to proceed to checkout");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-[#1F2B5B] mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-[#1F2B5B] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#283747] transition">
          Continue Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1F2B5B] mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border-b last:border-0">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center bg-gray-100 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 text-gray-600"><Minus className="w-4 h-4"/></button>
                      <span className="px-2 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-600"><Plus className="w-4 h-4"/></button>
                   </div>
                   <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              </div>
              <div className="font-bold text-lg">₹{item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-end">
           <div className="text-xl font-bold text-[#1F2B5B] mb-4">Subtotal: ₹{subtotal.toLocaleString()}</div>
           <p className="text-sm text-gray-500 mb-6">Shipping, taxes, and discounts calculated at checkout.</p>
           
           {/* LINK TO CHECKOUT */}
           <button 
             onClick={handleCheckout} 
             className="bg-[#1F2B5B] text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#283747] transition shadow-lg"
           >
             Proceed to Checkout
           </button>
        </div>
      </div>
    </div>
  );
}