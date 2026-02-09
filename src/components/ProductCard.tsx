import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  inStock: boolean;
  images: { url: string; color: string }[];
  colors?: { name: string; hex: string }[];
  sizes?: { size: string; inStock: boolean }[];
  features?: string[];
  careInstructions?: string[];
  fabric?: string;
  fit?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  breadcrumb?: { label: string; url: string }; 
}

export default function ProductCard({ product, breadcrumb }: ProductCardProps) {
  const formatReviews = (count: number) => {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
  };

  const discountAmount = product.originalPrice - product.price;

  // Always pick the FIRST image (Index 0)
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : "https://placehold.co/400x500?text=No+Image";

  // Only show rating if it exists
  const showRating = product.rating > 0 && product.reviewCount > 0;

  return (
    <Link 
      to={`/product/${product.slug}`} 
      state={{ breadcrumb }}
      className="group block relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={mainImage}
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        
        {product.badge && (
          <span className="absolute top-0 left-0 bg-[#F4C430] text-[#1F2B5B] text-[10px] md:text-xs font-bold px-2 py-1 z-10 uppercase tracking-wide">
            {product.badge}
          </span>
        )}

        {showRating && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 shadow-sm z-20">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-800">{product.rating}</span>
            <span className="text-xs text-gray-500 border-l border-gray-300 pl-1 ml-1">
              {formatReviews(product.reviewCount)}
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 pb-1">
        <h3 className="text-[13px] text-gray-700 font-normal leading-snug group-hover:text-[#1F2B5B] transition-colors truncate">
          {product.name}
        </h3>
        
        {/* 🔥 FIX: Added 'flex-wrap' and 'items-baseline' to handle long price strings gracefully */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mt-1">
          <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
          {discountAmount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="text-[10px] sm:text-xs font-bold text-green-600 truncate">
                ₹{discountAmount} OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}