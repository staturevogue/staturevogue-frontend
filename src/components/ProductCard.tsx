import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Helper to format review count (e.g. 1200 -> 1.2k)
  const formatReviews = (count: number) => {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
  };

  // Calculate discount percentage
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link to={`/product/${product.id}`} className="group block relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={product.images[0]}
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        
        {/* Badge (Top Left) */}
        {product.badge && (
          <span className="absolute top-0 left-0 bg-[#F4C430] text-[#1F2B5B] text-[10px] md:text-xs font-bold px-2 py-1 z-10 uppercase tracking-wide">
            {product.badge}
          </span>
        )}

        {/* Review Overlay (Bottom Left) */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 shadow-sm z-20">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-800">{product.rating}</span>
          <span className="text-xs text-gray-500 border-l border-gray-300 pl-1 ml-1">
            {formatReviews(product.reviewCount)}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-3 pb-1">
        <h3 className="text-[13px] text-gray-700 font-normal leading-snug group-hover:text-[#1F2B5B] transition-colors truncate">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
          <span className="text-xs font-bold text-green-600">
            {discount}% OFF
          </span>
        </div>
        
        <div className="text-xs text-green-600 mt-0.5">
          Lowest price in last 30 days
        </div>
      </div>
    </Link>
  );
}
