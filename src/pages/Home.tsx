import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Loader2, Plane, Luggage, Shirt, Leaf } from "lucide-react"; 
import ProductCard from "../components/ProductCard"; 
import { storeService } from "../services/api";

const CollectionCard = ({ title, image, slug }: { title: string, image: string, slug: string }) => (
  <Link to={`/products?collection=${slug}`} className="group block relative overflow-hidden h-full rounded-lg shadow-sm">
    <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
      <div className="absolute bottom-6 left-0 right-0 text-center px-4">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3 drop-shadow-md">{title}</h3>
        <span className="inline-block px-6 py-2 border border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-[#1F2B5B] transition-all duration-300">
          Shop Now
        </span>
      </div>
    </div>
  </Link>
);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Data State
  const [collections, setCollections] = useState<any[]>([]); 
  const [categories, setCategories] = useState<any[]>([]); 
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  
  // Dynamic Content State
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [brandStory, setBrandStory] = useState<any>(null);
  const [brandFeatures, setBrandFeatures] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // --- DEFAULTS ---
  const defaultSlides = [
    { image: "/images/hero/slide1.jpg", title: "Own the sky", subtitle: "In style", button_link: "/products", button_text: "SHOP NOW" },
    { image: "/images/hero/slide2.jpg", title: "Travel Essentials", subtitle: "Comfort Redefined", button_link: "/products?collection=casual", button_text: "SHOP NOW" },
  ];

  const defaultStory = {
    heading: "Our Story",
    content: "Staturevogue is all about modern, on-the-move must-haves. We aim to merge high-fashion minimalism with the uniqueness and comfort of athleisure.",
    image_1: "/images/products/men-oversize.jpg",
    image_2: "/images/products/women-dryfit.jpg"
  };

  const defaultFeatures = [
    { title: "On the move", icon: Plane },
    { title: "Travel Friendly", icon: Luggage },
    { title: "Utilitarian", icon: Shirt },
    { title: "Home Grown", icon: Leaf },
  ];

  const finalSlides = heroSlides.length > 0 ? heroSlides : defaultSlides;
  const finalStory = brandStory || defaultStory;
  const finalFeatures = brandFeatures.length > 0 ? brandFeatures : null; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Dynamic Content
        try {
            const content = await storeService.getWebContent();
            setHeroSlides(content.hero_slides || []);
            setBrandStory(content.brand_story || null);
            setBrandFeatures(content.brand_features || []);
        } catch (e) {
            console.warn("Dynamic content failed, using defaults");
        }

        // 2. Fetch Products
        const [cols, cats, newProds, bestProds] = await Promise.all([
            storeService.getCollections(),
            storeService.getCategories({ featured: true }),
            storeService.getProducts({ badge: 'NEW' }),
            storeService.getProducts({ badge: 'BESTSELLER' })
        ]);

        setCollections(cols.results || cols);
        setCategories(cats.results || cats);

        // 🔥 FIX 1: Sort New Arrivals Descending (Newest First) & Take Top 10
        const rawNew = newProds.results || newProds;
        const sortedNew = [...rawNew].sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
        setNewArrivals(sortedNew.slice(0, 10));

        // 🔥 FIX 2: Sort Best Sellers Descending (Newest First) & Take Top 10
        const rawBest = bestProds.results || bestProds;
        const sortedBest = [...rawBest].sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
        setBestSellers(sortedBest.slice(0, 10));

      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-[#1F2B5B]" /></div>;

  return (
    <div className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden group">
        {finalSlides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-700 
                ${index === currentSlide ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-center">
              <div className="text-white px-4">
                <h2 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{slide.title}</h2>
                <p className="text-xl md:text-2xl mb-8 font-light">{slide.subtitle}</p>
                <Link to={slide.button_link} className="bg-white text-[#1F2B5B] px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition shadow-lg">
                    {slide.button_text}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {finalSlides.length > 1 && (
            <>
                <button onClick={() => setCurrentSlide((c) => (c - 1 + finalSlides.length) % finalSlides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white transition z-20"><ChevronLeft /></button>
                <button onClick={() => setCurrentSlide((c) => (c + 1) % finalSlides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white transition z-20"><ChevronRight /></button>
            </>
        )}
      </section>

      {/* 1. MOST POPULAR */}
      {collections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1F2B5B]">Most Popular</h2>
            <p className="text-gray-500 mt-1">Check this out →</p>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="lg:hidden overflow-x-auto pb-6 -mx-4 scrollbar-hide">
              <div className="flex space-x-4 px-4 min-w-max">
                {collections.map((col: any) => (
                  <div key={col.id} className="flex-shrink-0 w-[280px]">
                    <CollectionCard title={col.title} image={col.image} slug={col.slug} />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
              {collections.map((col: any) => (
                <CollectionCard key={col.id} title={col.title} image={col.image} slug={col.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Shop by Category */}
      {categories.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-[#1F2B5B]">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat: any) => (
                <Link key={cat.id} to={`/products?category=${cat.name}`} className="group block text-center">
                  <div className="rounded-lg overflow-hidden aspect-[3/4] mb-3 relative bg-gray-100">
                    <img src={cat.image || "/placeholder.jpg"} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. BRAND STORY */}
      <section className="bg-[#1F2B5B] text-white overflow-hidden">
        <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <h3 className="text-xs font-bold tracking-[0.3em] text-[#F4C430] mb-4 uppercase">{finalStory.heading}</h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-300 mb-12 max-w-lg whitespace-pre-line">
                {finalStory.content}
            </p>
            
            <div className="grid grid-cols-4 gap-8 mb-8 border-t border-blue-800 pt-8">
                {finalFeatures ? (
                    finalFeatures.map((feature: any, i: number) => (
                        <div key={i} className="text-center flex flex-col items-center">
                            <img src={feature.icon_image} alt={feature.title} className="w-6 h-6 mb-2 opacity-80 invert brightness-0 filter" /> 
                            <span className="text-[10px] uppercase tracking-wide opacity-70">{feature.title}</span>
                        </div>
                    ))
                ) : (
                    defaultFeatures.map((f, i) => (
                        <div key={i} className="text-center flex flex-col items-center">
                            <f.icon className="w-6 h-6 mx-auto mb-2 opacity-80" />
                            <span className="text-[10px] uppercase tracking-wide opacity-70">{f.title}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
        <div className="md:w-1/2 grid grid-cols-2">
            <img src={finalStory.image_1 || "/placeholder.jpg"} className="w-full h-full object-cover" />
            <img src={finalStory.image_2 || "/placeholder.jpg"} className="w-full h-full object-cover" />
        </div>
        </div>
      </section>

      {/* 4. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-[#1F2B5B]">New Arrivals</h2>
            <Link to="/products?badge=NEW" className="text-[#1F2B5B] font-bold hover:underline flex items-center text-sm">View All <ArrowRight className="w-4 h-4 ml-1"/></Link>
          </div>
          {/* UI KEPT SAME: Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product: any) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}
      
      {/* 5. Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 border-t">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-[#1F2B5B]">Best Sellers</h2>
            <Link to="/products?badge=BESTSELLER" className="text-[#1F2B5B] font-bold hover:underline flex items-center text-sm">View All <ArrowRight className="w-4 h-4 ml-1"/></Link>
          </div>
          {/* UI KEPT SAME: Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product: any) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}
    </div>
  );
}