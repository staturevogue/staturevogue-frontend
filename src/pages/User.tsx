import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { 
  Package, MapPin, LogOut, Loader2, ChevronRight, 
  CheckCircle, AlertCircle, Trash2, Star, Plus, 
  XCircle, RefreshCw, RotateCcw, X, User, ChevronDown, Phone, Pencil,
  UploadCloud, FileVideo, Copy, Truck, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { orderService, authService,} from "../services/api"; 
import api from "../services/api";

// --- INTERFACES ---
interface OrderItem {
  id: number;
  product_name: string;
  variant_label: string;
  price: string;
  quantity: number;
  product_slug?: string;
  image?: string; 
  status: string; 
  exchange_coupon_code?: string;
  admin_comment?: string; 
}

interface Order {
  id: number;
  total_amount: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  shipping_address: string;
  phone: string;
  items: OrderItem[];
  razorpay_refund_id?: string;
  refunded_date?: string;
  payment_method: string; 
  tracking_link?: string; 
}

interface SavedAddress {
  id: number;
  label: string;
  first_name: string;
  last_name: string;
  address: string;
  apartment?: string; 
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

const RETURN_REASONS = [
    "Size doesn't fit", "Quality not as expected", "Received wrong item",
    "Damaged/Defective item", "Changed my mind", "Others"
];

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  
  // Data State
  const [userProfile, setUserProfile] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  // Address Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null); 
  
  const [addressForm, setAddressForm] = useState({ 
      label: 'Home', first_name: '', last_name: '', 
      address: '', apartment: '', city: '', state: 'Telangana', 
      zip_code: '', country: 'India', phone: '', is_default: false 
  });
  
  const [submittingAddress, setSubmittingAddress] = useState(false);

  // Action Modal State
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState<number | null>(null); 
  const [actionType, setActionType] = useState<'return' | 'exchange'>('return');
  const [selectedReason, setSelectedReason] = useState("");
  const [proofVideo, setProofVideo] = useState<File | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/login"); return; }

    const fetchData = async () => {
      try {
        const [profile, orders, addr] = await Promise.all([
            authService.getProfile(),
            orderService.getUserOrders(),
            authService.getSavedAddresses()
        ]);
        
        setUserProfile(profile);
        setAllOrders(Array.isArray(orders) ? orders : orders.results || []);
        
        // 🔥 FIX 1: Handle Pagination for Addresses correctly on load
        setAddresses(Array.isArray(addr) ? addr : addr.results || []);
      } catch (e) {
        console.error("Failed to load user data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // --- HANDLERS ---
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem('cart'); 
    toast.success("Logged out successfully");
    navigate("/login"); 
  };

  const refreshOrders = async () => {
      const updated = await orderService.getUserOrders();
      setAllOrders(Array.isArray(updated) ? updated : updated.results);
  };

  const handleCancelOrder = async (orderId: number) => {
    toast.warning("Cancel this order?", {
      description: "Refund will be initiated to your original payment method.",
      action: {
        label: "Yes, Cancel",
        onClick: async () => {
          try {
            await api.post(`/orders/${orderId}/cancel/`);
            toast.success("Order cancelled successfully");
            refreshOrders();
          } catch (err: any) {
            toast.error(
              err.response?.data?.error ||
              "Unable to cancel order at this stage"
            );
          }
        },
      },
      cancel: { label: "No", onClick: () => {} },
      duration: 5000,
    });
  };

  const openActionModal = (itemId: number, type: 'return' | 'exchange') => {
      setSelectedItemForAction(itemId);
      setActionType(type);
      setSelectedReason("");
      setProofVideo(null); 
      setActionModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setProofVideo(e.target.files[0]);
      }
  };

  const handleSubmitAction = async () => {
      if (!selectedReason || !selectedItemForAction) {
          toast.error("Please select a reason.");
          return;
      }
      if (!proofVideo) {
          toast.error("Please upload an unboxing video.");
          return;
      }

      setIsSubmittingAction(true);
      try {
          const formData = new FormData();
          formData.append('type', actionType);
          formData.append('reason', selectedReason);
          formData.append('video', proofVideo); 

          await api.post(`/orders/items/${selectedItemForAction}/request-action/`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });

          toast.success("Request submitted successfully!");
          setActionModalOpen(false);

          setTimeout(() => { refreshOrders(); }, 500);
      } catch (err: any) { 
          toast.error(err.response?.data?.error || "Request failed"); 
      } finally { 
          setIsSubmittingAction(false); 
      }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Coupon code copied!");
  };

  // --- ADDRESS HANDLERS (FIXED) ---
  
  const handleEditAddress = (addr: SavedAddress) => {
      setAddressForm({
          label: addr.label, first_name: addr.first_name, last_name: addr.last_name,
          address: addr.address, apartment: addr.apartment || '', city: addr.city, state: addr.state,
          zip_code: addr.zip_code, country: addr.country, phone: addr.phone, is_default: addr.is_default
      });
      setEditingAddressId(addr.id);
      setShowAddForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setAddressForm({ label: 'Home', first_name: '', last_name: '', address: '', apartment: '', city: '', state: 'Telangana', zip_code: '', country: 'India', phone: '', is_default: false });
      setEditingAddressId(null);
      setShowAddForm(false);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAddress(true);
    try {
      // 1. Send Request
      if (editingAddressId) {
          await api.put(`/auth/addresses/${editingAddressId}/`, addressForm);
          toast.success("Address updated successfully");
      } else {
          await authService.saveAddress(addressForm);
          toast.success("Address saved successfully");
      }
      
      // 2. Reset UI
      resetForm();
      
      // 3. Fetch Updated List
      const updated = await authService.getSavedAddresses();
      
      // 🔥 FIX 2: Handle Pagination correctly (extract results if present)
      const newAddressList = Array.isArray(updated) ? updated : (updated.results || []);
      setAddresses(newAddressList);

    } catch(err: any) { 
      // 🔥 FIX 3: Show exact error from backend
      console.error("Address Error:", err.response);
      const msg = err.response?.data 
        ? Object.values(err.response.data).flat().join(", ") 
        : "Failed to save address";
      toast.error(msg); 
    } finally { 
      setSubmittingAddress(false); 
    }
  };

  const handleDeleteAddress = async (id: number) => {
      if(!window.confirm("Delete this address?")) return;
      try {
        await authService.deleteAddress(id);
        setAddresses(addresses.filter(a => a.id !== id));
        toast.success("Address deleted");
      } catch(e) { toast.error("Failed to delete"); }
  };

  const handleSetDefault = async (id: number) => {
      try {
        await authService.setDefaultAddress(id);
        const updated = await authService.getSavedAddresses();
        // 🔥 FIX 4: Handle Pagination here too
        setAddresses(Array.isArray(updated) ? updated : updated.results || []);
        toast.success("Default updated");
      } catch(e) { toast.error("Failed"); }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Delivered': 
          case 'Exchange Approved': 
          case 'Return Approved': return 'bg-green-100 text-green-700 border-green-200';
          
          case 'Cancelled': 
          case 'Return Rejected':
          case 'Exchange Rejected': return 'bg-red-100 text-red-700 border-red-200';
          
          case 'Refunded': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'Processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          
          case 'Return Requested':
          case 'Exchange Requested': return 'bg-orange-100 text-orange-700 border-orange-200';
          
          default: return 'bg-blue-100 text-blue-700 border-blue-200';
      }
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
        case 'orders':
            const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
            const paginatedOrders = allOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
            const totalPages = Math.ceil(allOrders.length / ORDERS_PER_PAGE);

            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold text-[#1F2B5B]">My Orders</h2>
                        <button onClick={refreshOrders} className="text-sm text-blue-600 hover:underline">
                            ↻ Refresh Status
                        </button>
                    </div>

                    {allOrders.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No orders placed yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paginatedOrders.map((order, idx) => {
                                const canCancelOrder = ['Processing', 'Pending'].includes(order.order_status);
                                const globalIndex = startIndex + idx;
                                const userOrderNumber = allOrders.length - globalIndex;
                                const isExpanded = expandedOrderId === order.id;

                                return (
                                    <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        {/* Header */}
                                        <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                            <div>
                                                <p className="font-bold text-[#1F2B5B] text-lg">Order #{userOrderNumber}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap justify-end">
                                                <span className="font-bold text-gray-900">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.order_status)}`}>
                                                    {order.order_status}
                                                </span>

                                                {order.tracking_link && (
                                                    <a href={order.tracking_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-[#1F2B5B] text-white px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-[#283747] transition-colors shadow-sm">
                                                        <Truck className="w-3 h-3" /> Track Order
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Refund Section */}
                                        {(order.payment_status === 'Refunded' || order.order_status === 'Refunded' || order.razorpay_refund_id) && (
                                            <div className="bg-purple-50 border-b border-purple-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm animate-in fade-in">
                                                <div className="flex items-center gap-2 text-purple-800">
                                                    <RefreshCw className="w-4 h-4" />
                                                    <span className="font-bold">Refund Processed</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 text-purple-700 text-xs sm:text-sm">
                                                    {order.razorpay_refund_id ? (
                                                        <div className="flex gap-1">
                                                            <span className="opacity-70">Ref ID:</span>
                                                            <span className="font-mono font-bold select-all">{order.razorpay_refund_id}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-1">
                                                            <span className="font-medium italic">
                                                                {order.payment_method === 'COD' ? "Amount refunded to your bank account" : "Refund processed manually (Shipping deducted)"}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {order.refunded_date && (
                                                        <div className="flex gap-1">
                                                            <span className="opacity-70">Date:</span>
                                                            <span className="font-bold">{order.refunded_date}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-4">
                                            {order.items.map((item, i) => {
                                                const productUrl = item.product_slug ? `/product/${item.product_slug}` : "#";
                                                const isDelivered = order.order_status === 'Delivered';
                                                const canAction = isDelivered && item.status === 'Ordered'; 

                                                return (
                                                    <div key={i} className="flex flex-col gap-3 py-4 border-b border-gray-50 last:border-0">
                                                        <div className="flex gap-4 items-start">
                                                            <Link to={productUrl} className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 block">
                                                                {item.image ? <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Package className="w-6 h-6" /></div>}
                                                            </Link>
                                                            <div className="flex-1">
                                                                <Link to={productUrl} className="font-bold text-gray-800 text-sm hover:text-[#1F2B5B] hover:underline block mb-1">{item.product_name}</Link>
                                                                <p className="text-xs text-gray-500">{item.variant_label} | Qty: {item.quantity}</p>
                                                                <p className="text-xs font-medium text-gray-900 mt-1">₹{parseFloat(item.price).toLocaleString()}</p>
                                                                {item.status !== 'Ordered' && (
                                                                    <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${item.status.includes('Approved') ? 'bg-green-100 text-green-700' : item.status.includes('Rejected') ? 'bg-red-100 text-red-700' : item.status.includes('Requested') ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'}`}>{item.status}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {canAction && (
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => openActionModal(item.id, 'return')} className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded border border-orange-100 transition-colors">Return Item</button>
                                                                <button onClick={() => openActionModal(item.id, 'exchange')} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded border border-blue-100 transition-colors">Exchange Item</button>
                                                            </div>
                                                        )}
                                                        {(item.status === 'Return Rejected' || item.status === 'Exchange Rejected') && item.admin_comment && (
                                                            <div className="mt-2 bg-red-50 border border-red-200 p-3 rounded-lg flex gap-3 items-start animate-in fade-in">
                                                                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-xs font-bold text-red-800 uppercase">Request Rejected</p>
                                                                    <p className="text-xs text-red-700 mt-1">{item.admin_comment}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.status === 'Exchange Approved' && item.exchange_coupon_code && (
                                                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex justify-between items-center gap-2 animate-in fade-in">
                                                                <div>
                                                                    <p className="text-xs font-bold text-green-800">Exchange Approved!</p>
                                                                    <p className="text-[10px] text-green-600">Use code for free replacement.</p>
                                                                </div>
                                                                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-green-200 cursor-pointer hover:bg-green-50 transition-colors" onClick={() => copyToClipboard(item.exchange_coupon_code!)}>
                                                                    <code className="text-sm font-bold text-green-700">{item.exchange_coupon_code}</code>
                                                                    <Copy className="w-3 h-3 text-green-500" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {isExpanded && (
                                                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in slide-in-from-top-2 duration-300">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Delivery Details</h4>
                                                    <div className="flex flex-col sm:flex-row gap-6">
                                                        <div className="flex gap-3">
                                                            <MapPin className="w-4 h-4 text-[#1F2B5B] mt-0.5" />
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                                                                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{order.shipping_address}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <Phone className="w-4 h-4 text-[#1F2B5B] mt-0.5" />
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Contact Number</p>
                                                                <p className="text-sm font-medium text-gray-800">{order.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-2 flex flex-wrap justify-between items-center gap-4">
                                                <button onClick={() => setExpandedOrderId(isExpanded ? null : order.id)} className="flex items-center gap-1 text-sm font-bold text-[#1F2B5B] hover:text-[#F4C430] transition-colors">
                                                    {isExpanded ? 'Hide Details' : 'View Order Details'}
                                                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                                {canCancelOrder && (
                                                    <div className="flex gap-3">
                                                        <button onClick={() => handleCancelOrder(order.id)} className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-md border border-red-100 transition-colors">
                                                            <XCircle className="w-3 h-3" /> Cancel Order
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    <button disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 text-sm">Prev</button>
                                    <span className="px-3 py-1 bg-[#1F2B5B] text-white rounded text-sm font-bold">{currentPage}</span>
                                    <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p=>p+1)} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 text-sm">Next</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );

        case 'addresses':
            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#1F2B5B]">Saved Addresses</h2>
                        {!showAddForm && addresses.length < 3 && (
                            <button onClick={() => { resetForm(); setShowAddForm(true); }} className="bg-[#1F2B5B] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#283747] transition-all flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        )}
                    </div>

                    {showAddForm ? (
                        <form onSubmit={handleSaveAddress} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-top-2">
                            <h3 className="font-bold text-lg mb-4 text-gray-900">{editingAddressId ? 'Edit Address' : 'New Address Details'}</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <input placeholder="First Name" value={addressForm.first_name} onChange={e=>setAddressForm({...addressForm, first_name:e.target.value})} className="p-2 border rounded" required />
                                <input placeholder="Last Name" value={addressForm.last_name} onChange={e=>setAddressForm({...addressForm, last_name:e.target.value})} className="p-2 border rounded" />
                                <input placeholder="Label (Home/Office)" value={addressForm.label} onChange={e=>setAddressForm({...addressForm, label:e.target.value})} className="p-2 border rounded" required />
                                <input placeholder="Phone" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone:e.target.value})} className="p-2 border rounded" required />
                                <input placeholder="Address" value={addressForm.address} onChange={e=>setAddressForm({...addressForm, address:e.target.value})} className="md:col-span-2 p-2 border rounded" required />
                                <input placeholder="Apartment (Optional)" value={addressForm.apartment} onChange={e=>setAddressForm({...addressForm, apartment:e.target.value})} className="md:col-span-2 p-2 border rounded" />
                                <input placeholder="City" value={addressForm.city} onChange={e=>setAddressForm({...addressForm, city:e.target.value})} className="p-2 border rounded" required />
                                <input placeholder="Zip Code" value={addressForm.zip_code} onChange={e=>setAddressForm({...addressForm, zip_code:e.target.value})} className="p-2 border rounded" required />
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" id="is_default" checked={addressForm.is_default} onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})} className="w-4 h-4 text-[#1F2B5B] rounded" />
                                <label htmlFor="is_default" className="text-sm text-gray-700">Set as default address</label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button disabled={submittingAddress} className="bg-[#1F2B5B] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#283747]">{submittingAddress ? 'Saving...' : 'Save Address'}</button>
                                <button type="button" onClick={resetForm} className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid gap-4">
                            {addresses.length === 0 ? <p className="text-gray-500 text-center py-4">No addresses saved.</p> : addresses.map((addr) => (
                                <div key={addr.id} className={`bg-white border p-5 rounded-xl flex justify-between items-center shadow-sm transition-all ${addr.is_default ? 'border-[#1F2B5B] bg-blue-50/10' : 'border-gray-200'}`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-[#1F2B5B]">{addr.label}</span>
                                            {addr.is_default && <span className="text-[10px] bg-[#1F2B5B] text-white px-2 py-0.5 rounded-full font-bold">DEFAULT</span>}
                                        </div>
                                        <p className="text-sm text-gray-600">{addr.first_name} {addr.last_name}</p>
                                        <p className="text-sm text-gray-600">{addr.address}</p>
                                        {addr.apartment && <p className="text-sm text-gray-600">{addr.apartment}</p>}
                                        <p className="text-sm text-gray-600">{addr.city} - {addr.zip_code}</p>
                                        <p className="text-xs text-gray-500 mt-1">Phone: {addr.phone}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {!addr.is_default && <button onClick={() => handleSetDefault(addr.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full" title="Set Default"><Star className="w-4 h-4" /></button>}
                                        <button onClick={() => handleEditAddress(addr)} className="text-gray-600 hover:bg-gray-100 p-2 rounded-full" title="Edit"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        default: return null;
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[#1F2B5B]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 md:pt-36 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 bg-white rounded-xl shadow-sm p-6 h-fit border border-gray-100">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#1F2B5B] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0] || userProfile?.email?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-medium">Hello,</p>
                <p className="text-base font-bold truncate text-gray-900" title={userProfile?.email}>
                    {userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}` : userProfile?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-400 truncate">{userProfile?.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {[ { id: 'orders', label: 'My Orders', icon: Package }, { id: 'addresses', label: 'Saved Addresses', icon: MapPin } ].map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-[#1F2B5B] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1F2B5B]'}`}>
                  <div className="flex items-center gap-3"><item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />{item.label}</div>
                  {activeTab === item.id && <ChevronRight className="h-4 w-4 text-white/80" />}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"><LogOut className="h-4 w-4" /> Logout</button>
              </div>
            </nav>
          </aside>
          <main className="flex-1 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 min-h-[500px]">
            {renderContent()}
          </main>
        </div>
      </div>

      {actionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <button onClick={() => setActionModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                <h3 className="text-xl font-bold text-[#1F2B5B] mb-2 capitalize">Request {actionType}</h3>
                <p className="text-sm text-gray-500 mb-4">Please select a reason:</p>
                <div className="space-y-2 mb-6">
                    {RETURN_REASONS.map((reason) => (
                        <label key={reason} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedReason === reason ? 'border-[#1F2B5B] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" className="w-4 h-4 text-[#1F2B5B] focus:ring-[#1F2B5B]" checked={selectedReason === reason} onChange={() => setSelectedReason(reason)} />
                            <span className="ml-3 text-sm font-medium text-gray-700">{reason}</span>
                        </label>
                    ))}
                </div>
                <p className="text-sm text-gray-500 mb-2">Upload Opening Video (Mandatory):</p>
                <div className="mb-6">
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${proofVideo ? 'border-[#1F2B5B] bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {proofVideo ? (
                                <>
                                    <FileVideo className="w-8 h-8 text-[#1F2B5B] mb-2" />
                                    <p className="text-sm text-gray-700 font-medium truncate max-w-[200px]">{proofVideo.name}</p>
                                    <p className="text-xs text-green-600 mt-1">Video selected</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> unboxing video</p>
                                    <p className="text-xs text-gray-400">MP4, MOV (Max 50MB)</p>
                                </>
                            )}
                        </div>
                        <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                    </label>
                </div>
                <button onClick={handleSubmitAction} disabled={isSubmittingAction || !selectedReason || !proofVideo} className="w-full bg-[#1F2B5B] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#283747] disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {isSubmittingAction ? "Uploading & Submitting..." : "Submit Request"}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;