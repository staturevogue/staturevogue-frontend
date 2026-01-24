import { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { storeService, orderService, authService } from "../services/api"; 
import { toast } from "sonner";

// 🔥 FIX: Define Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart(); // Added clearCart
  const navigate = useNavigate();
  const cartTotal = getCartTotal();

  // --- STATE ---
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  // Set defaults to 0 so nothing "wrong" shows up while loading
  const [config, setConfig] = useState({
    shipping_flat_rate: 0,
    shipping_free_above: 0,
    tax_rate_percentage: 0,
  });

  const [discountCode, setDiscountCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    country: "India",
  });

  // --- 1. FETCH CONFIGURATION ---
  useEffect(() => {
    const init = async () => {
      try {
        const data = await storeService.getSiteConfig();
        setConfig({
          shipping_flat_rate: parseFloat(data.shipping_flat_rate) || 0,
          shipping_free_above: parseFloat(data.shipping_free_above) || 0,
          tax_rate_percentage: parseFloat(data.tax_rate_percentage) || 0,
        });
        
        // Auto-fill user email if logged in
        try {
            const user = await authService.getProfile();
            if(user?.email) setFormData(prev => ({...prev, email: user.email}));
        } catch(e) { /* Not logged in */ }

      } catch (error) {
        console.error("Config error", error);
      } finally {
        setLoadingConfig(false);
      }
    };
    init();
  }, []);

  // --- 2. CALCULATIONS ---
  const calculations = useMemo(() => {
    // Shipping Logic
    const isFreeShipping = config.shipping_flat_rate === 0 || (config.shipping_free_above > 0 && cartTotal >= config.shipping_free_above);
    const shippingCost = isFreeShipping ? 0 : config.shipping_flat_rate;
    
    let discountAmount = 0;
    if (couponData) {
      discountAmount = couponData.discount;
    }

    const taxableAmount = Math.max(0, cartTotal - discountAmount);
    
    // Tax Logic
    const taxAmount = (taxableAmount * config.tax_rate_percentage) / 100;
    
    const finalTotal = taxableAmount + taxAmount + shippingCost;

    return { shippingCost, isFreeShipping, discountAmount, taxAmount, finalTotal };
  }, [cartTotal, config, couponData]);

  // --- 3. HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!discountCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const res = await storeService.validateCoupon(discountCode, cartTotal);
      if (res.success) {
        setCouponData(res);
        toast.success(res.message);
      }
    } catch (err: any) {
      setCouponData(null);
      toast.error(err.response?.data?.error || "Invalid coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.email || !formData.address || !formData.phone) {
        toast.error("Please fill in all details");
        return;
    }
    setIsPaying(true);

    try {
        // 🔥 FIX 1: Send Product ID, Size, and Color
        const orderPayload = {
            ...formData,
            items: cartItems.map(item => ({
                product_id: item.productId, // Use 'product_id' (Matches Backend)
                quantity: item.quantity,
                color: item.color,          // Required for variant lookup
                size: item.size,            // Required for variant lookup
                price: item.price
            }))
        };
        
        // 1. Create Order on Backend
        const orderResp = await orderService.createOrder(orderPayload);

        // 2. Open Razorpay Payment Window
        const options = {
            key: orderResp.key,
            amount: orderResp.amount,
            currency: "INR",
            name: "Your Store Name",
            description: "Order Payment",
            order_id: orderResp.razorpay_order_id,
            
            // 🔥 FIX 2: Handle Success & Verify on Backend
            handler: async function (response: any) {
                try {
                    const verifyPayload = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    // Call backend to verify signature & mark as paid
                    await orderService.verifyPayment(verifyPayload);
                    
                    toast.success("Order Placed Successfully!");
                    
                    // Clear Cart & Redirect
                    clearCart();
                    navigate("/user"); // Or navigate("/user")

                } catch (error) {
                    console.error("Verification failed", error);
                    toast.error("Payment successful but verification failed. Please contact support.");
                    navigate("/user");
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: "#1F2B5B",
            },
            modal: {
                ondismiss: function() {
                    setIsPaying(false);
                    toast("Payment cancelled");
                }
            }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error(error);
        toast.error("Payment initiation failed. Please try again.");
    } finally {
        setIsPaying(false);
    }
  };

  if (loadingConfig) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <h1 className="text-2xl font-bold text-[#1F2B5B] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT: FORM */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Contact & Delivery</h2>
              <div className="space-y-4">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="p-3 border rounded-lg" />
                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="p-3 border rounded-lg" />
                </div>
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="p-3 border rounded-lg" />
                    <input type="text" name="pinCode" placeholder="PIN Code" value={formData.pinCode} onChange={handleInputChange} className="p-3 border rounded-lg" />
                </div>
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
              </div>
            </div>

            <button onClick={handlePayment} disabled={isPaying} className="w-full bg-[#1F2B5B] text-white py-4 rounded-lg font-bold hover:bg-[#283747] transition">
                {isPaying ? "Processing..." : `Pay ₹${calculations.finalTotal.toLocaleString()}`}
            </button>
          </div>

          {/* RIGHT: SUMMARY */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} className="w-16 h-16 rounded-md object-cover border" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} | {item.size} | {item.color}</p>
                    </div>
                    <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    placeholder="Coupon Code" 
                    className="flex-1 p-2 border rounded uppercase text-sm"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button 
                    onClick={couponData ? () => {setCouponData(null); setDiscountCode("")} : handleApplyCoupon}
                    className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300"
                >
                    {couponData ? "Remove" : "Apply"}
                </button>
              </div>
              
              {couponData && <p className="text-xs text-green-600 mb-4">Coupon applied! You saved ₹{calculations.discountAmount}</p>}

              {/* Totals */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={calculations.isFreeShipping ? "text-green-600" : ""}>
                        {calculations.isFreeShipping ? "FREE" : `₹${calculations.shippingCost}`}
                    </span>
                </div>

                {calculations.taxAmount > 0 && (
                    <div className="flex justify-between">
                        <span>GST ({config.tax_rate_percentage}%)</span>
                        <span>₹{calculations.taxAmount.toFixed(2)}</span>
                    </div>
                )}

                {calculations.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{calculations.discountAmount}</span></div>
                )}
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>₹{calculations.finalTotal.toLocaleString()}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}