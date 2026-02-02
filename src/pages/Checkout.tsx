import { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Loader2, MapPin, Plus, CheckCircle, Home, Briefcase } from "lucide-react"; 
import { storeService, orderService, authService } from "../services/api"; 
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const cartTotal = getCartTotal();

  // --- STATE ---
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [config, setConfig] = useState({
    shipping_flat_rate: 0,
    shipping_free_above: 0,
    tax_rate_percentage: 0,
  });

  const [discountCode, setDiscountCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>("new");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "", 
    phone: "",
    country: "India",
  });

  // --- 1. FETCH DATA & AUTO-FILL ---
  useEffect(() => {
    const init = async () => {
      try {
        const configData = await storeService.getSiteConfig();
        setConfig({
          shipping_flat_rate: parseFloat(configData.shipping_flat_rate) || 0,
          shipping_free_above: parseFloat(configData.shipping_free_above) || 0,
          tax_rate_percentage: parseFloat(configData.tax_rate_percentage) || 0,
        });
        
        try {
            const user = await authService.getProfile();
            const addresses = await authService.getSavedAddresses();
            const addrList = Array.isArray(addresses) ? addresses : addresses.results || [];
            setSavedAddresses(addrList);

            setFormData(prev => ({
                ...prev, 
                email: user.email, 
                firstName: user.first_name, 
                lastName: user.last_name
            }));

            const defaultAddr = addrList.find((a: any) => a.is_default);
            if (defaultAddr) {
                fillAddressForm(defaultAddr);
                setSelectedAddressId(defaultAddr.id);
            }
        } catch(e) { /* Not logged in */ }

      } catch (error) {
        console.error("Config error", error);
      } finally {
        setLoadingConfig(false);
      }
    };
    init();
  }, []);

  const fillAddressForm = (addr: any) => {
      setFormData(prev => ({
          ...prev,
          firstName: addr.first_name || prev.firstName,
          lastName: addr.last_name || prev.lastName,
          address: addr.address,
          apartment: addr.apartment || "",
          city: addr.city,
          state: addr.state,
          pinCode: addr.zip_code, 
          phone: addr.phone,
          country: addr.country || "India"
      }));
  };

  // 🔥 NEW: Handle clicking a card
  const selectAddress = (id: number | string) => {
      setSelectedAddressId(id);
      if (id === "new") {
          // Clear fields for new entry
          setFormData(prev => ({
              ...prev,
              address: "", apartment: "", city: "", state: "", pinCode: "", phone: "", country: "India"
          }));
      } else {
          const selected = savedAddresses.find(a => a.id === id);
          if (selected) fillAddressForm(selected);
      }
  };

  // --- 2. CALCULATIONS ---
  const calculations = useMemo(() => {
    const isFreeShipping = config.shipping_flat_rate === 0 || (config.shipping_free_above > 0 && cartTotal >= config.shipping_free_above);
    const shippingCost = isFreeShipping ? 0 : config.shipping_flat_rate;
    
    let discountAmount = 0;
    if (couponData) {
      discountAmount = couponData.discount;
    }

    const taxableAmount = Math.max(0, cartTotal - discountAmount);
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
    if (!formData.email || !formData.address || !formData.phone || !formData.pinCode) {
        toast.error("Please fill in all details");
        return;
    }
    setIsPaying(true);

    try {
        const orderPayload = {
            ...formData,
            zip_code: formData.pinCode,
            items: cartItems.map(item => ({
                product_id: item.productId, 
                quantity: item.quantity,
                color: item.color,
                size: item.size,
                price: item.price
            }))
        };
        
        const orderResp = await orderService.createOrder(orderPayload);

        const options = {
            key: orderResp.key,
            amount: orderResp.amount,
            currency: "INR",
            name: "Stature Vogue",
            description: "Order Payment",
            order_id: orderResp.razorpay_order_id,
            handler: async function (response: any) {
                try {
                    await orderService.verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });
                    toast.success("Order Placed Successfully!");
                    clearCart();
                    navigate("/user"); 
                } catch (error) {
                    toast.error("Payment verified failed. Contact support.");
                    navigate("/user");
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone,
            },
            theme: { color: "#1F2B5B" },
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
        toast.error("Payment initiation failed.");
    } finally {
        setIsPaying(false);
    }
  };

  if (loadingConfig) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <h1 className="text-2xl font-bold text-[#1F2B5B] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT: FORM */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#1F2B5B]" /> Delivery Address
              </h2>

              {/* 🔥 NEW: CARD GRID UI for Addresses */}
              {savedAddresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {savedAddresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                              <div 
                                  key={addr.id}
                                  onClick={() => selectAddress(addr.id)}
                                  className={`relative p-4 border rounded-xl cursor-pointer transition-all ${
                                      isSelected 
                                      ? "border-[#1F2B5B] bg-blue-50 ring-1 ring-[#1F2B5B]" 
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                              >
                                  {isSelected && (
                                      <div className="absolute top-3 right-3 text-[#1F2B5B]">
                                          <CheckCircle className="w-5 h-5 fill-current" />
                                      </div>
                                  )}
                                  <div className="flex items-center gap-2 mb-2">
                                      {addr.label === "Home" ? <Home className="w-4 h-4 text-gray-500"/> : <Briefcase className="w-4 h-4 text-gray-500"/>}
                                      <span className="font-bold text-sm text-[#1F2B5B]">{addr.label}</span>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">{addr.first_name} {addr.last_name}</p>
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                      {addr.address}
                                      {addr.apartment ? `, ${addr.apartment}` : ''}
                                      <br/>
                                      {addr.city}, {addr.zip_code}
                                  </p>
                              </div>
                          );
                      })}
                      
                      {/* "Add New" Card */}
                      <div 
                          onClick={() => selectAddress("new")}
                          className={`flex flex-col items-center justify-center p-4 border border-dashed rounded-xl cursor-pointer transition-all ${
                              selectedAddressId === "new"
                              ? "border-[#1F2B5B] bg-blue-50"
                              : "border-gray-300 hover:border-[#1F2B5B]"
                          }`}
                      >
                          <Plus className="w-6 h-6 text-[#1F2B5B] mb-2" />
                          <span className="text-sm font-medium text-[#1F2B5B]">Add New Address</span>
                      </div>
                  </div>
              )}

              {/* Form Fields (Always visible for editing or new) */}
              <div className="space-y-4 animate-in slide-in-from-top-2">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" required />
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" required />
                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" required />
                </div>
                <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" required />
                <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" value={formData.apartment} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" />
                
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" required />
                    <input type="text" name="pinCode" placeholder="PIN Code" value={formData.pinCode} onChange={handleInputChange} className="p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} className="p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" required />
                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="p-3 border rounded-lg focus:outline-none focus:border-[#1F2B5B]" required />
                </div>
              </div>
            </div>

            <button onClick={handlePayment} disabled={isPaying} className="w-full bg-[#1F2B5B] text-white py-4 rounded-lg font-bold hover:bg-[#283747] transition disabled:opacity-70">
                {isPaying ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-5 h-5"/> Processing...</span> : `Pay ₹${calculations.finalTotal.toLocaleString()}`}
            </button>
          </div>

          {/* RIGHT: SUMMARY (Unchanged from previous) */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-3 last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.color} | {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    placeholder="Discount Code" 
                    className="flex-1 p-2 border rounded uppercase text-sm focus:outline-none focus:border-[#1F2B5B]"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button 
                    onClick={couponData ? () => {setCouponData(null); setDiscountCode("")} : handleApplyCoupon}
                    disabled={isValidatingCoupon}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                >
                    {isValidatingCoupon ? "..." : (couponData ? "Remove" : "Apply")}
                </button>
              </div>
              
              {couponData && <div className="bg-green-50 text-green-700 text-xs p-2 rounded mb-4 text-center">Coupon applied! You saved ₹{calculations.discountAmount}</div>}

              {/* Totals */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={calculations.isFreeShipping ? "text-green-600 font-medium" : ""}>
                        {calculations.isFreeShipping ? "FREE" : `₹${calculations.shippingCost}`}
                    </span>
                </div>
                {calculations.taxAmount > 0 && (
                    <div className="flex justify-between text-gray-600"><span>GST ({config.tax_rate_percentage}%)</span><span>₹{calculations.taxAmount.toFixed(2)}</span></div>
                )}
                {calculations.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{calculations.discountAmount}</span></div>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t mt-2 text-[#1F2B5B]">
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