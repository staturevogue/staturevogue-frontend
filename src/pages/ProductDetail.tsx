import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import {
  Star, Heart, Share2, ChevronLeft, ChevronRight, Check, 
  Truck, RotateCcw, Shield, User, ThumbsUp, ShoppingBag
} from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Find product or fallback
  const productData = products.find(p => p.id === id);
  const product = productData || products[0];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || "");
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  // --- MOCK REVIEWS DATA ---
  const reviews = [
    {
      id: 1,
      user: "Rahul Sharma",
      date: "2 days ago",
      rating: 5,
      title: "Perfect fit and amazing fabric!",
      content: "I was skeptical about the size, but the M fits me perfectly. The fabric is breathable and feels premium. Definitely buying another color.",
      verified: true,
      helpful: 12,
      images: []
    },
    {
      id: 2,
      user: "Priya Venkatesh",
      date: "1 week ago",
      rating: 4,
      title: "Great quality, slightly loose",
      content: "The material quality is top-notch as expected from Staturevogue. However, the L size runs a bit larger than other brands. I suggest sizing down if you prefer a slim fit.",
      verified: true,
      helpful: 8,
      images: []
    },
    {
      id: 3,
      user: "Amit Verma",
      date: "2 weeks ago",
      rating: 5,
      title: "Value for money",
      content: "Got this during the sale. For the price, the quality is unbeatable. The color hasn't faded after 3 washes.",
      verified: true,
      helpful: 24,
      images: []
    },
    {
      id: 4,
      user: "Sneha Reddy",
      date: "3 weeks ago",
      rating: 3,
      title: "Good but delivery was slow",
      content: "Product is good, but it took 7 days to reach Hyderabad. Packaging could be better.",
      verified: true,
      helpful: 2,
      images: []
    }
  ];

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity
    };
    addToCart(cartItem);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      {/* Breadcrumb - SMALLER TEXT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center text-xs text-gray-600">
          <a href="/" className="hover:text-[#1F2B5B]">Home</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-[#1F2B5B]">Products</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium text-sm">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Product Images */}
          <div>
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition">
                <ChevronLeft className="w-5 h-5 text-[#1F2B5B]" />
              </button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition">
                <ChevronRight className="w-5 h-5 text-[#1F2B5B]" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${currentImage === index ? "border-[#1F2B5B]" : "border-gray-200"}`}
                >
                  <img src={image} alt={`View ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details - SMALLER TEXT - NO BUTTONS HERE */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3 text-sm sm:text-base">{product.name}</h1>

            <div className="flex items-center mb-3">
              <div className="flex items-center text-[#F4C430]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="ml-2 text-xs font-medium">{product.rating}</span>
              <span className="ml-2 text-xs text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline space-x-2 mb-6">
              <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
              <span className="text-sm font-bold text-[#28A745]">
                 ₹{product.originalPrice - product.price} OFF
              </span>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              {/* Color Selection - SMALLER */}
              <div className="mb-4">
                <h3 className="font-semibold text-xs mb-2">Select Color: <span className="font-normal text-gray-600">{selectedColor}</span></h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name ? "border-[#1F2B5B] ring-1 ring-[#1F2B5B]" : "border-gray-300"}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection - SMALLER */}
              <div className="mb-4">
                <h3 className="font-semibold text-xs mb-2">Select Size: <span className="font-normal text-gray-600">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeOption) => (
                    <button
                      key={sizeOption.size}
                      onClick={() => sizeOption.inStock && setSelectedSize(sizeOption.size)}
                      disabled={!sizeOption.inStock}
                      className={`py-1.5 px-3 border rounded text-xs font-medium transition-all ${
                        selectedSize === sizeOption.size
                          ? "bg-[#1F2B5B] text-white border-[#1F2B5B]"
                          : sizeOption.inStock
                            ? "bg-white text-gray-700 hover:border-[#1F2B5B]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {sizeOption.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity - SMALLER */}
              <div>
                <h3 className="font-semibold text-xs mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 border rounded hover:bg-gray-50 flex items-center justify-center text-sm">-</button>
                  <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-50 flex items-center justify-center text-sm">+</button>
                </div>
              </div>
            </div>

            {/* Heart + Share - SMALLER */}
            <div className="flex space-x-3 mb-6">
              <button className="w-12 h-12 border rounded-lg flex items-center justify-center hover:bg-gray-50 text-xs"><Heart className="w-5 h-5 text-gray-700" /></button>
              <button className="w-12 h-12 border rounded-lg flex items-center justify-center hover:bg-gray-50 text-xs"><Share2 className="w-5 h-5 text-gray-700" /></button>
            </div>

            {/* Trust Badges - SMALLER */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-xs">
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="w-5 h-5 text-[#1F2B5B]" />
                <span>Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw className="w-5 h-5 text-[#1F2B5B]" />
                <span>Easy Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Shield className="w-5 h-5 text-[#1F2B5B]" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section - MOBILE RESPONSIVE */}
        <div className="mt-12 border-t pt-6 pb-20">
          <div className="flex gap-4 border-b mb-6 overflow-x-auto pb-4 scrollbar-hide">
            {["description", "features", "care", "reviews"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 whitespace-nowrap font-medium capitalize text-sm border-b-2 transition-colors flex-shrink-0 ${
                  activeTab === tab 
                    ? "border-[#1F2B5B] text-[#1F2B5B]" 
                    : "border-transparent text-gray-500 hover:text-[#1F2B5B]"
                }`}
              >
                {tab === "reviews" ? `Reviews (${product.reviewCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="prose max-w-none text-gray-700 text-sm">
            {activeTab === "description" && (
              <div className="animate-fade-in">
                <p className="leading-relaxed mb-4">{product.description}</p>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Material & Fabric</h4>
                    <p className="text-sm">{product.fabric}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Fit & Sizing</h4>
                    <p className="text-sm">{product.fit} - Fits true to size</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "care" && (
              <ul className="list-disc pl-5 space-y-1 animate-fade-in text-sm">
                {product.careInstructions.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            )}

            {/* --- REVIEWS TAB IMPLEMENTATION --- */}
            {activeTab === "reviews" && (
              <div className="animate-fade-in">
                <div className="grid gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{review.user}</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>{review.date}</span>
                              {review.verified && (
                                <span className="flex items-center text-green-600 gap-1 bg-green-50 px-2 py-0.5 rounded-full text-xs">
                                  <Check className="w-3 h-3" /> Verified Buyer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex text-[#F4C430]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      
                      <h5 className="font-bold text-gray-800 text-sm mb-1">{review.title}</h5>
                      <p className="text-gray-600 text-sm mb-3">{review.content}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1 cursor-pointer hover:text-[#1F2B5B]">
                          <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View More Button */}
                <div className="mt-6 text-center">
                  <button className="border border-gray-300 px-4 py-1.5 rounded-full text-xs font-medium hover:border-[#1F2B5B] hover:text-[#1F2B5B] transition">
                    Load More Reviews
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 FIXED BOTTOM BUTTONS - Horizontal Half Half */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex gap-3">
          <button 
            onClick={handleAddToCart}
            className="flex-1 border-2 border-[#1F2B5B] bg-white text-[#1F2B5B] py-3 px-4 rounded-lg font-bold text-sm hover:bg-[#1F2B5B] hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            ADD TO CART
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-1 bg-[#1F2B5B] text-white py-3 px-4 rounded-lg font-bold text-sm hover:bg-[#283747] transition-all shadow-lg flex items-center justify-center"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
}
