import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import {
  Star, ChevronLeft, ChevronRight, Check, 
  ShoppingBag, Loader2, PenSquare, 
  Share2, X, Copy, Plus, Minus, ChevronDown
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
  
  // UI States
  const [activeTab, setActiveTab] = useState("description"); // Desktop
  const [openAccordion, setOpenAccordion] = useState<string | null>("description"); // Mobile

  // Review & Share States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewName, setNewReviewName] = useState(""); 
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
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
    if (e) { e.preventDefault(); e.stopPropagation(); }
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

  const handleShare = async () => {
    const shareData = {
        title: product.name,
        text: `Check out ${product.name} on Stature Vogue!`,
        url: window.location.href,
    };
    if (navigator.share) {
        try { await navigator.share(shareData); } catch (err) { console.log("Share cancelled"); }
    } else {
        setIsShareModalOpen(true);
    }
  };
//submit
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
        toast.error("Failed to submit review.");
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % displayImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  const toggleAccordion = (section: string) => setOpenAccordion(openAccordion === section ? null : section);

  // --- CONTENT RENDERERS ---
  const renderDescription = () => (
    <div className="prose max-w-none text-gray-600 text-sm leading-7 animate-in fade-in slide-in-from-bottom-2">
      <p>{product.description}</p>
    </div>
  );

  const renderFeatures = () => (
    <ul className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-2">
      {product.features?.map((f: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Check className="w-4 h-4 text-[#1F2B5B] mt-0.5 flex-shrink-0" />
          <span className="leading-snug">{f}</span>
        </li>
      ))}
    </ul>
  );

  const renderCare = () => (
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
        {product.careInstructions?.map((c: string, i: number) => <li key={i}>{c}</li>)}
      </ul>
    </div>
  );

  const renderReviews = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div>
            <h3 className="font-bold text-xl text-[#1F2B5B]">Customer Reviews</h3>
            <div className="flex items-center gap-2 mt-1">
                <div className="flex text-[#F4C430]">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300"}`} />
                    ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                    {hasReviews ? `${product.rating} out of 5` : "No ratings yet"}
                </span>
            </div>
        </div>
        <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="w-full md:w-auto bg-[#1F2B5B] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#283747] flex items-center justify-center gap-2 shadow-sm transition-all"
        >
            <PenSquare className="w-4 h-4" /> Write a Review
        </button>
      </div>

      {hasReviews ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                    {review.user_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{review.user_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-[#F4C430]">
                            {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />))}
                        </div>
                        <span className="text-xs text-gray-400">• {review.created_at}</span>
                    </div>
                  </div>
                </div>
                {review.purchased_variant && (
                    <span className="hidden sm:inline-block text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        Verified Purchase
                    </span>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
            <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
        </div>
      )}
    </div>
  );

  // 🔥 HELPER: Product Header Component (Title, Rating, Price)
  // We use this to render it twice (Mobile & Desktop) without duplicating logic
  const renderProductHeader = () => (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-[#1F2B5B] mb-2 leading-tight">{product.name}</h1>
      
      {hasReviews && (
        <div className="flex items-center gap-2 mb-3 md:mb-6">
          <div className="flex text-[#F4C430] text-sm">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300"}`} />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">{reviews.length} Reviews</span>
        </div>
      )}

    <div className="mb-6 md:mb-8">
  <div className="flex items-end gap-3">
    <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
      ₹{displayPrice}
    </span>

    {showDiscount && (
      <>
        

        <span className="text-sm font-bold text-green-600">
          ₹{discountAmount} OFF
        </span>
      </>
    )}
  </div>

  {showDiscount && (
    <p className="mt-1 text-s text-gray-600">
      MRP: <span className="line-through">₹{product.originalPrice}</span>
      <span className="ml-1">Inclusive of all taxes</span>
    </p>
  )}
</div>

    </>
  );

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[#1F2B5B]" /></div>;
  if (!product) return null;

  const hasReviews = reviews.length > 0;
  const showDiscount = product.originalPrice && Number(product.originalPrice) > displayPrice;
  const discountAmount = showDiscount ? Number(product.originalPrice) - displayPrice : 0;

  const breadcrumbLabel = location.state?.breadcrumb?.label || product.category || "Products";
  const breadcrumbLink = location.state?.breadcrumb?.url || `/products?category=${encodeURIComponent(product.category || "")}`;

  return (
    <div className="min-h-screen bg-white pb-24 relative pt-28 md:pt-36">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center text-xs text-gray-500">
          <span className="cursor-pointer hover:text-[#1F2B5B]" onClick={() => navigate('/')}>Home</span>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span className="cursor-pointer hover:text-[#1F2B5B] capitalize" onClick={() => navigate(breadcrumbLink)}>{breadcrumbLabel}</span>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* --- LEFT COLUMN: IMAGES & MOBILE HEADER --- */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden group border border-gray-100">
              <img
                src={displayImages[currentImage]?.url || "https://placehold.co/600x800?text=No+Image"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              <button onClick={handleShare} className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-sm hover:bg-[#1F2B5B] hover:text-white transition-all z-20">
                <Share2 className="w-5 h-5" />
              </button>
              

              {displayImages.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:scale-110 transition"><ChevronLeft className="w-5 h-5 text-[#1F2B5B]" /></button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:scale-110 transition"><ChevronRight className="w-5 h-5 text-[#1F2B5B]" /></button>
                </>
                
              )}
              
            </div>

            {/* 🔥 MOBILE ONLY: HEADER DIRECTLY UNDER MAIN IMAGE */}
            <div className="md:hidden mt-4 mb-6">
                {renderProductHeader()}
            </div>

            {/* Thumbnails (Now below the title/price on Mobile) */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {displayImages.map((image: any, index: number) => (
                <button 
                    key={index} 
                    onClick={() => setCurrentImage(index)} 
                    className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImage === index ? "border-[#1F2B5B]" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={image.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: DETAILS & DESKTOP HEADER --- */}
          <div>
            {/* 🔥 DESKTOP ONLY: HEADER AT TOP OF COLUMN */}
            <div className="hidden md:block">
                {renderProductHeader()}
            </div>

            <div className="space-y-6 border-t border-gray-100 pt-6">
              {/* Color Selector */}
              <div>
                <span className="text-sm font-bold text-gray-900">Color: <span className="font-normal text-gray-600">{selectedColor}</span></span>
                <div className="flex gap-3 mt-3">
                  {product.colors?.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => { setSelectedColor(color.name); setCurrentImage(0); }}
                      className={`group relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${selectedColor === color.name ? "border-[#1F2B5B] ring-2 ring-offset-2 ring-[#1F2B5B]" : "border-gray-200 hover:border-gray-400"}`}
                    >
                      <img src={getImageForColor(color.name)} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-900">Size: <span className="font-normal text-gray-600">{selectedSize || "Select a size"}</span></span>
                    <button className="text-xs text-[#1F2B5B] underline decoration-dotted">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.length > 0 ? availableSizes.map((sizeOption: any) => {
                      const isOutOfStock = sizeOption.stock <= 0;
                      return (
                        <button
                          key={sizeOption.size}
                          onClick={() => !isOutOfStock && setSelectedSize(sizeOption.size)}
                          disabled={isOutOfStock}
                          className={`min-w-[48px] h-12 px-4 border rounded-lg text-sm font-medium transition-all relative flex items-center justify-center
                            ${selectedSize === sizeOption.size 
                                ? "bg-[#1F2B5B] text-white border-[#1F2B5B] shadow-md" 
                                : isOutOfStock 
                                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" 
                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#1F2B5B] hover:text-[#1F2B5B]"
                            }`}
                        >
                          {sizeOption.size}
                          {isOutOfStock && <div className="absolute inset-0 bg-white/50"><div className="w-full h-[1px] bg-gray-400 rotate-45 absolute top-1/2 left-0"></div></div>}
                        </button>
                      );
                    }) : <span className="text-sm text-gray-400 italic">Select a color to see sizes</span>}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <h3 className="font-semibold text-xs mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 border rounded hover:bg-gray-50 flex items-center justify-center text-sm"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-50 flex items-center justify-center text-sm"><Plus className="w-3 h-3" /></button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 mb-6">
                <button className="flex-1 border-2 border-[#1F2B5B] bg-white text-[#1F2B5B] py-3 px-4 rounded-lg font-bold text-sm hover:bg-[#1F2B5B] hover:text-white transition-all flex items-center justify-center gap-2" onClick={handleAddToCart}><ShoppingBag className="w-5 h-5" /> ADD TO CART</button>
                <button className="flex-1 bg-[#1F2B5B] text-white py-3 px-4 rounded-lg font-bold text-sm hover:bg-[#283747] transition-all" onClick={handleBuyNow}>BUY NOW</button>
              </div>
            </div>

            {/* --- DESKTOP TABS --- */}
            <div className="hidden md:block mt-16">
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                    {["description", "features", "care", "reviews"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                                activeTab === tab 
                                    ? "border-[#1F2B5B] text-[#1F2B5B]" 
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            {tab === "reviews" ? `Reviews (${reviews.length})` : tab}
                        </button>
                    ))}
                </div>
                <div className="min-h-[200px]">
                    {activeTab === "description" && renderDescription()}
                    {activeTab === "features" && renderFeatures()}
                    {activeTab === "care" && renderCare()}
                    {activeTab === "reviews" && renderReviews()}
                </div>
            </div>

            {/* --- MOBILE ACCORDIONS --- */}
            <div className="md:hidden mt-10 space-y-4">
                {[
                    { id: "description", label: "Description", content: renderDescription() },
                    { id: "features", label: "Features", content: renderFeatures() },
                    { id: "care", label: "Care Instructions", content: renderCare() },
                    { id: "reviews", label: `Reviews (${reviews.length})`, content: renderReviews() },
                ].map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleAccordion(section.id)}
                            className={`w-full flex justify-between items-center p-4 bg-white font-bold text-sm text-[#1F2B5B] ${openAccordion === section.id ? "bg-gray-50" : ""}`}
                        >
                            {section.label}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === section.id ? "rotate-180" : ""}`} />
                        </button>
                        <div 
                            className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                                openAccordion === section.id ? "max-h-[800px]" : "max-h-0"
                            }`}
                        >
                            <div className="p-4 border-t border-gray-100 bg-white">
                                {section.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
                <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-[#1F2B5B] mb-6 text-center">Share Product</h3>
                <div className="space-y-3">
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); setIsShareModalOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"><Copy className="w-5 h-5" /></div>
                        <div className="text-left"><p className="font-semibold text-gray-800 text-sm">Copy Link</p></div>
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
                        <input type="text" value={newReviewName} onChange={(e) => setNewReviewName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#1F2B5B] focus:border-[#1F2B5B]" placeholder="John Doe" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button type="button" key={star} onClick={() => setNewReviewRating(star)}><Star className={`w-6 h-6 ${star <= newReviewRating ? "fill-[#F4C430] text-[#F4C430]" : "text-gray-300"}`} /></button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                        <textarea value={newReviewComment} onChange={(e) => setNewReviewComment(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm h-32 resize-none focus:ring-[#1F2B5B] focus:border-[#1F2B5B]" placeholder="How was the product?" required></textarea>
                    </div>
                    <button type="submit" disabled={isSubmittingReview} className="w-full bg-[#1F2B5B] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#283747] disabled:bg-gray-400">{isSubmittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}