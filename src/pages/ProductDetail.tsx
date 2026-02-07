import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import {
  Star, ChevronLeft, ChevronRight, Check, 
  Truck, RotateCcw, Shield, User, ShoppingBag, Loader2, PenSquare, 
  Share2, X, Copy, MessageCircle, Twitter
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { storeService } from "../services/api"; 
import { toast } from "sonner";

export default function ProductDetail() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [displayPrice, setDisplayPrice] = useState<number>(0);

  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  
  // --- REVIEW STATE ---
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewName, setNewReviewName] = useState(""); 
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // --- 🔥 SHARE STATE ---
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        if (!slug) return;
        
        const productData = await storeService.getProductBySlug(slug as string);
        setProduct(productData);
        setDisplayPrice(Number(productData.price));

        const reviewsData = await storeService.getReviews(slug as string);
        setReviews(reviewsData.results || reviewsData);

        if (productData.colors?.length > 0) {
          setSelectedColor(productData.colors[0].name);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [slug]);

  const displayImages = useMemo(() => {
    if (!product) return [];
    const safeColor = (c: string) => c?.toLowerCase().trim();
    const filtered = product.images.filter((img: any) => 
        safeColor(img.color) === safeColor(selectedColor) || 
        img.color === null || 
        img.color === "all"
    );
    return filtered.length > 0 ? filtered : product.images;
  }, [product, selectedColor]);

  const availableSizes = useMemo(() => {
    if (!product || !selectedColor) return [];
    const normalize = (str: string) => str?.toLowerCase().trim();
    const colorObj = product.colors.find((c: any) => 
        normalize(c.name) === normalize(selectedColor)
    );
    if (colorObj && Array.isArray(colorObj.sizes)) {
        return colorObj.sizes;
    }
    return []; 
  }, [product, selectedColor]);

  useEffect(() => { 
      setSelectedSize(""); 
      if (product) setDisplayPrice(Number(product.price)); 
  }, [selectedColor]);

  useEffect(() => {
    if (selectedSize && availableSizes.length > 0) {
        const sizeObj = availableSizes.find((s: any) => s.size === selectedSize);
        if (sizeObj && sizeObj.price) {
            setDisplayPrice(Number(sizeObj.price));
        }
    }
  }, [selectedSize, availableSizes]);

  const getImageForColor = (colorName: string) => {
    const img = product.images.find((i: any) => i.color === colorName);
    return img ? img.url : product.images[0]?.url;
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (!selectedSize) { toast.error("Please select a size", { id: "size-error" }); return; }
    const sizeObj = availableSizes.find((s: any) => s.size === selectedSize);
    if (sizeObj && sizeObj.stock <= 0) { toast.error("This size is out of stock", { id: "stock-error" }); return; }

    const cartItem = {
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      originalPrice: product.originalPrice,
      image: displayImages[0]?.url,
      color: selectedColor,
      size: selectedSize,
      quantity
    };
    
    addToCart(cartItem);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    handleAddToCart(); 
    navigate('/cart'); 
  };

  // 🔥 UPDATED SHARE LOGIC
  const handleShare = async () => {
    const shareData = {
        title: product.name,
        text: `Check out ${product.name} on Stature Vogue!`,
        url: window.location.href,
    };

    // 1. Try Native Share (Mobile)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log("Share cancelled");
        }
    } else {
        // 2. Fallback to Modal (Desktop)
        setIsShareModalOpen(true);
    }
  };

  const copyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
      setIsShareModalOpen(false);
  };

  const shareWhatsApp = () => {
      const text = encodeURIComponent(`Check out ${product.name} on Stature Vogue! ${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
      setIsShareModalOpen(false);
  };

  const shareTwitter = () => {
      const text = encodeURIComponent(`Check out ${product.name} on Stature Vogue!`);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      setIsShareModalOpen(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim()) { toast.error("Please enter your name"); return; }

    setIsSubmittingReview(true);
    try {
        await storeService.addReview(slug as string, {
            user_name: newReviewName,
            rating: newReviewRating,
            comment: newReviewComment,
        });

        toast.success("Review submitted successfully!");
        setIsReviewModalOpen(false);
        setNewReviewComment("");
        setNewReviewName("");
        setNewReviewRating(5);
        
        const updatedReviews = await storeService.getReviews(slug as string);
        setReviews(updatedReviews.results || updatedReviews);

    } catch (error: any) {
        if (error.response?.status === 400 && Array.isArray(error.response.data)) {
             toast.error(error.response.data[0]); 
        } else if (error.response?.status === 401) {
             toast.error("Please log in to write a review.");
        } else {
             toast.error("Failed to submit review. Have you purchased this item?");
        }
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % displayImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[#1F2B5B]" /></div>;
  if (!product) return null;

  const hasReviews = reviews.length > 0;
  const showDiscount = product.originalPrice && Number(product.originalPrice) > displayPrice;
  const discountAmount = showDiscount ? Number(product.originalPrice) - displayPrice : 0;

  const breadcrumbLabel = location.state?.breadcrumb?.label || product.category || "Products";
  const breadcrumbLink = location.state?.breadcrumb?.url 
      ? location.state.breadcrumb.url 
      : `/products?category=${encodeURIComponent(product.category || "")}`;

  return (
    // 🔥 FIX: Added 'pt-28 md:pt-36' to fix cropping behind header
    <div className="min-h-screen bg-white pb-24 relative pt-28 md:pt-36">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center text-xs text-gray-600">
          <span className="cursor-pointer hover:text-[#1F2B5B]" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span 
            className="cursor-pointer hover:text-[#1F2B5B] capitalize" 
            onClick={() => navigate(breadcrumbLink)}
          >
            {breadcrumbLabel}
          </span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Images Section */}
          <div>
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden mb-4 group">
              <img
                src={displayImages[currentImage]?.url || "https://placehold.co/600x800?text=No+Image"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* 🔥 SHARE BUTTON ON IMAGE */}
              <button 
                onClick={handleShare}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-20 group/share hover:scale-105 transition-all"
                title="Share this product"
              >
                <Share2 className="w-5 h-5 text-gray-600 group-hover/share:text-[#1F2B5B]" />
              </button>

              {displayImages.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition"><ChevronLeft className="w-5 h-5 text-[#1F2B5B]" /></button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition"><ChevronRight className="w-5 h-5 text-[#1F2B5B]" /></button>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {displayImages.map((image: any, index: number) => (
                <button key={index} onClick={() => setCurrentImage(index)} className={`aspect-square rounded-lg overflow-hidden border-2 ${currentImage === index ? "border-[#1F2B5B]" : "border-gray-200"}`}>
                  <img src={image.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {hasReviews && (
              <div className="flex items-center mb-3">
                <div className="flex items-center text-[#F4C430]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="ml-2 text-xs font-medium">{product.rating}</span>
                <span className="ml-2 text-xs text-gray-500">({reviews.length} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline space-x-2 mb-6">
              <span className="text-2xl font-bold text-gray-900">₹{displayPrice}</span>
              {showDiscount && (
                  <>
                    <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-bold text-[#28A745]">₹{discountAmount} OFF</span>
                  </>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="mb-4">
                <h3 className="font-semibold text-xs mb-2">Select Color: <span className="font-normal text-gray-600">{selectedColor}</span></h3>
                <div className="flex gap-3">
                  {product.colors && product.colors.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => { setSelectedColor(color.name); setCurrentImage(0); }}
                      className={`w-14 h-16 rounded-md border-2 overflow-hidden relative ${selectedColor === color.name ? "border-[#1F2B5B] ring-1 ring-[#1F2B5B]" : "border-gray-200"}`}
                    >
                      <img src={getImageForColor(color.name)} className="w-full h-full object-cover" />
                      {selectedColor === color.name && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Check className="text-white w-4 h-4" /></div>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-xs mb-2">Select Size: <span className="font-normal text-gray-600">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes && availableSizes.length > 0 ? (
                    availableSizes.map((sizeOption: any) => {
                      const isOutOfStock = sizeOption.stock <= 0;
                      return (
                        <button
                          key={sizeOption.size}
                          onClick={() => !isOutOfStock && setSelectedSize(sizeOption.size)}
                          disabled={isOutOfStock}
                          className={`min-w-[40px] h-10 px-3 border rounded text-xs font-medium transition-all relative ${
                            selectedSize === sizeOption.size
                              ? "bg-[#1F2B5B] text-white border-[#1F2B5B]"
                              : isOutOfStock
                                ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:border-[#1F2B5B]"
                          }`}
                        >
                          {sizeOption.size}
                          {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1px] bg-gray-300 rotate-45"></div></div>}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-500 italic">Select a valid color to view sizes</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-xs mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 border rounded hover:bg-gray-50 flex items-center justify-center text-sm">-</button>
                  <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-50 flex items-center justify-center text-sm">+</button>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mb-6">
              <button className="flex-1 border-2 border-[#1F2B5B] bg-white text-[#1F2B5B] py-3 px-4 rounded-lg font-bold text-sm hover:bg-[#1F2B5B] hover:text-white transition-all flex items-center justify-center gap-2" onClick={handleAddToCart}><ShoppingBag className="w-5 h-5" /> ADD TO CART</button>
              <button className="flex-1 bg-[#1F2B5B] text-white py-3 px-4 rounded-lg font-bold text-sm hover:bg-[#283747] transition-all" onClick={handleBuyNow}>BUY NOW</button>
            </div>
            
            
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 border-t pt-6 pb-20">
          <div className="flex gap-4 border-b mb-6 overflow-x-auto pb-4 scrollbar-hide">
            {["description", "features", "care", "reviews"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 whitespace-nowrap font-medium capitalize text-sm border-b-2 transition-colors flex-shrink-0 ${
                  activeTab === tab ? "border-[#1F2B5B] text-[#1F2B5B]" : "border-transparent text-gray-500 hover:text-[#1F2B5B]"
                }`}
              >
                {tab === "reviews" ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="prose max-w-none text-gray-700 text-sm">
            {activeTab === "description" && <div className="animate-fade-in"><p className="leading-relaxed">{product.description}</p></div>}
            {activeTab === "features" && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                {product.features?.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm"><Check className="w-3 h-3 text-green-600" />{f}</li>
                ))}
              </ul>
            )}
            {activeTab === "care" && (
              <ul className="list-disc pl-5 space-y-1 animate-fade-in text-sm">
                {product.careInstructions?.map((c: string, i: number) => <li key={i}>{c}</li>)}
              </ul>
            )}
            {activeTab === "reviews" && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-8 bg-gray-50 p-6 rounded-lg">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Customer Reviews</h3>
                        <div className="flex items-center mt-1">
                            <div className="flex text-[#F4C430]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300"}`} />
                                ))}
                            </div>
                            <span className="ml-2 text-sm font-medium">
                                {hasReviews ? `${product.rating} out of 5` : "No ratings yet"}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsReviewModalOpen(true)}
                        className="bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                        <PenSquare className="w-4 h-4" /> Write a Review
                    </button>
                </div>
                {hasReviews ? (
                    <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600"><User className="w-4 h-4" /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{review.user_name}</h4>
                                <div className="flex flex-col gap-1 text-xs text-gray-500">
                                  <span>{review.created_at}</span>
                                  {review.purchased_variant && (
                                    <span className="text-green-600 font-medium text-[10px] bg-green-50 px-2 py-0.5 rounded-full inline-block w-fit">
                                      ✓ {review.purchased_variant}
                                    </span>
                                  )}
                                </div>
                            </div>
                            </div>
                            <div className="flex text-[#F4C430]">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />))}</div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400">
                            <Star className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">No Reviews Yet</h4>
                        <p className="text-gray-500 text-sm mb-4">Be the first to review this product.</p>
                        <button onClick={() => setIsReviewModalOpen(true)} className="text-[#1F2B5B] font-medium text-sm hover:underline">Write a Review Now</button>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 SHARE MODAL (Desktop Fallback) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
                <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-[#1F2B5B] mb-6 text-center">Share Product</h3>
                
                <div className="grid grid-cols-1 gap-3">
                    <button onClick={copyLink} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                            <Copy className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">Copy Link</p>
                            <p className="text-xs text-gray-500">Copy to clipboard</p>
                        </div>
                    </button>

                    <button onClick={shareWhatsApp} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors text-left group">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">WhatsApp</p>
                            <p className="text-xs text-gray-500">Share with friends</p>
                        </div>
                    </button>

                    <button onClick={shareTwitter} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors text-left group">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">Twitter / X</p>
                            <p className="text-xs text-gray-500">Post a tweet</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95">
                <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                        <input 
                            type="text"
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#1F2B5B] focus:border-[#1F2B5B]"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button type="button" key={star} onClick={() => setNewReviewRating(star)}>
                                    <Star className={`w-6 h-6 ${star <= newReviewRating ? "fill-[#F4C430] text-[#F4C430]" : "text-gray-300"}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                        <textarea 
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm h-32 resize-none focus:ring-[#1F2B5B] focus:border-[#1F2B5B]"
                            placeholder="How was the product? How is the fit?"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" disabled={isSubmittingReview} className="w-full bg-[#1F2B5B] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#283747] disabled:bg-gray-400">
                        {isSubmittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}