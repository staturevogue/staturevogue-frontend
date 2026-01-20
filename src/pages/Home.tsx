import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Plane, Shirt, Leaf, Luggage } from "lucide-react"; 
import { products } from "../data/products";
import ProductCard from "../components/ProductCard"; 

// --- MINIMAL CARD (Thinner Font as requested) ---
const MinimalCard = ({ title, image, link }: { title: string, image: string, link: string }) => (
  <Link to={link} className="group block relative overflow-hidden h-full rounded-lg shadow-sm">
    <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
      <div className="absolute bottom-6 left-0 right-0 text-center px-4">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3 drop-shadow-md">
          {title}
        </h3>
        <span className="inline-block px-6 py-2 border border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-[#1F2B5B] transition-all duration-300">
          Shop Now
        </span>
      </div>
    </div>
  </Link>
);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    { image: "/images/hero/slide1.jpg", title: "Own the sky", subtitle: "In style", link: "/products" },
    { image: "/images/hero/slide2.jpg", title: "Travel Essentials", subtitle: "Comfort Redefined", link: "/products?collection=casual" },
  ];

  const popularCategories = [
    { title: "Premium Polos", image: "/images/products/men-polo.jpg", link: "/products?category=Polos" },
    { title: "Street Oversize", image: "/images/products/men-oversize.jpg", link: "/products?category=Oversize%20T-shirts" },
    { title: "Semi Formal", image: "/images/products/men-pants.jpg", link: "/products?category=Semi%20Formal%20Pants" },
    { title: "Dry Fit Active", image: "/images/products/men-dryfit-round.jpg", link: "/products?category=Dry%20Fit" },
  ];

  const collections = [
    { name: "Crew Neck", image: "/images/products/men-crew.jpg", link: "/products?category=Crew%20Neck" },
    { name: "Oversize", image: "/images/products/women-oversize.jpg", link: "/products?category=Oversize%20T-shirts" },
    { name: "Polos", image: "/images/products/men-polo.jpg", link: "/products?category=Polos" },
    { name: "Dry Fit", image: "/images/products/women-dryfit.jpg", link: "/products?category=Dry%20Fit" },
    { name: "Tracks", image: "/images/products/men-tracks.jpg", link: "/products?category=Regular%20tracks" },
    { name: "Shorts", image: "/images/products/men-shorts.jpg", link: "/products?category=Shorts" },
  ];

  const newArrivals = products.slice(0, 4);
  const bestsellers = products.filter(p => p.badge === "BESTSELLER").slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden group">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-center">
              <div className="text-white px-4">
                <h2 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{slide.title}</h2>
                <p className="text-xl md:text-2xl mb-8 font-light">{slide.subtitle}</p>
                <Link to={slide.link} className="bg-white text-[#1F2B5B] px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition shadow-lg">SHOP NOW</Link>
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => setCurrentSlide((c) => (c - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white text-white hover:text-black transition"><ChevronLeft /></button>
        <button onClick={() => setCurrentSlide((c) => (c + 1) % heroSlides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white text-white hover:text-black transition"><ChevronRight /></button>
      </section>

     {/* 1. MOST POPULAR - ORIGINAL DESKTOP SIZE + MOBILE HORIZONTAL */}
<section className="max-w-7xl mx-auto px-4 py-16">
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-[#1F2B5B]">Most Popular</h2>
    <p className="text-gray-500 mt-1 cursor-pointer hover:text-[#1F2B5B]">Check this out →</p>
  </div>
  
  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
    {/* MOBILE: Horizontal scroll */}
    <div className="lg:hidden overflow-x-auto pb-6 -mx-4 scrollbar-hide">
      <div className="flex space-x-4 px-4 min-w-max">
        {popularCategories.map((cat, idx) => (
          <div key={idx} className="flex-shrink-0 w-[280px]">
            <MinimalCard {...cat} />
          </div>
        ))}
      </div>
    </div>
    
    {/* DESKTOP: EXACT ORIGINAL GRID - h-full with aspect-[3/4] */}
    <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
      {popularCategories.map((cat, idx) => (
        <MinimalCard key={idx} {...cat} />
      ))}
    </div>
  </div>
</section>



      {/* 2. Shop by Collection */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-[#1F2B5B]">Shop by Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {collections.map((col, idx) => (
              <Link key={idx} to={col.link} className="group block text-center">
                <div className="rounded-lg overflow-hidden aspect-[3/4] mb-3 relative bg-gray-100">
                  <img src={col.image} alt={col.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <h3 className="font-semibold text-sm text-gray-800">{col.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Our Story */}
      <section className="bg-[#1F2B5B] text-white overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <h3 className="text-xs font-bold tracking-[0.3em] text-[#F4C430] mb-4 uppercase">Our Story</h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-300 mb-12 max-w-lg">
              Staturevogue is all about modern, on-the-move must-haves. We aim to merge high-fashion minimalism with the uniqueness and comfort of athleisure. 
              Our collections are crafted with the best of fabric and premium cotton and our silhouettes are high on the trend quotient.
            </p>
            <div className="grid grid-cols-4 gap-8 mb-8 border-t border-blue-800 pt-8">
              <div className="text-center">
                <Plane className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <span className="text-[10px] uppercase tracking-wide opacity-70">On the move</span>
              </div>
              <div className="text-center">
                <Luggage className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <span className="text-[10px] uppercase tracking-wide opacity-70">Travel Friendly</span>
              </div>
              <div className="text-center">
                <Shirt className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <span className="text-[10px] uppercase tracking-wide opacity-70">Utilitarian</span>
              </div>
              <div className="text-center">
                <Leaf className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <span className="text-[10px] uppercase tracking-wide opacity-70">Home Grown</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 grid grid-cols-2">
            <img src="/images/products/men-oversize.jpg" className="w-full h-full object-cover" />
            <img src="/images/products/women-dryfit.jpg" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 4. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-[#1F2B5B]">New Arrivals</h2>
          <Link to="/products?collection=new" className="text-[#1F2B5B] font-bold hover:underline flex items-center text-sm">View All <ArrowRight className="w-4 h-4 ml-1"/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
      
      {/* 5. Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-[#1F2B5B]">Best Sellers</h2>
          <Link to="/products?collection=bestsellers" className="text-[#1F2B5B] font-bold hover:underline flex items-center text-sm">View All <ArrowRight className="w-4 h-4 ml-1"/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestsellers.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
