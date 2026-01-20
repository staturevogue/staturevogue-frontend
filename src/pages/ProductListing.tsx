import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X, Check, ArrowUpDown } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard"; 

export default function ProductListing() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("Price"); 
  const [searchParams] = useSearchParams();
  
  const urlCategory = searchParams.get("category");
  const urlGender = searchParams.get("gender");
  const urlCollection = searchParams.get("collection");

  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [showCategoryLanding, setShowCategoryLanding] = useState(false);
  const [currentGender, setCurrentGender] = useState<string | null>(null);

  // 1️⃣ Category Landing Logic - Men/Women ONLY
  useEffect(() => {
    if (urlGender && !urlCategory) {
      setShowCategoryLanding(true);
      setCurrentGender(urlGender);
    } else {
      setShowCategoryLanding(false);
      setCurrentGender(null);
    }
  }, [urlGender, urlCategory]);

  // 2️⃣ Reset filters
  useEffect(() => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedGenders([]);
    setPriceRange([0, 5000]);
  }, [urlCategory, urlGender, urlCollection]);

  // 3️⃣ Get gender-specific categories with REAL product images
  // 3️⃣ Get gender-specific categories with REAL product images - FIXED
const getGenderCategories = (gender: string): {name: string, image: string, link: string}[] => {
  return products
    .filter(p => p.gender === gender)
    .reduce((acc: {name: string, image: string, link: string}[], product) => {
      const categoryName = product.category;
      const categoryExists = acc.some(cat => cat.name === categoryName);
      
      if (!categoryExists) {
        acc.push({
          name: categoryName,
          image: product.images[0], // ✅ REAL PRODUCT IMAGE
          link: `/products?gender=${gender}&category=${encodeURIComponent(categoryName)}`
        });
      }
      return acc;
    }, [])
    .slice(0, 6); // Top 6 categories
};


  // 4️⃣ Featured products for landing page (same gender only)
  const featuredProducts = useMemo(() => {
    if (!currentGender) return [];
    return products
      .filter(p => p.gender === currentGender)
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)) // Best rated
      .slice(0, 4);
  }, [currentGender]);

  // 5️⃣ Gender mix logic (unchanged)
  const hasMixedGenders = useMemo(() => {
    const contextProducts = products.filter(product => {
      if (urlCategory && product.category !== urlCategory) return false;
      if (urlCollection === "new") {
         if (!product.badge || (!product.badge.includes("NEW") && !product.badge.includes("TRENDING"))) return false;
      }
      if (urlCollection === "bestsellers") {
         if (product.badge !== "BESTSELLER") return false;
      }
      return true;
    });
    const hasMen = contextProducts.some(p => p.gender === "Men");
    const hasWomen = contextProducts.some(p => p.gender === "Women");
    return hasMen && hasWomen;
  }, [urlCategory, urlCollection]);

  const mobileFilterTabs = ["Price", "Color", "Size", "Availability"];
  if (!urlGender && hasMixedGenders) {
    mobileFilterTabs.splice(3, 0, "Category");
  }

  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes.map(s => s.size))));
  const allColors = Array.from(new Set(products.flatMap(p => p.colors.map(c => c.name))));

  const toggleFilter = (item: string, list: string[], setList: (a: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (urlGender && product.gender !== urlGender) return false; // ✅ ONLY SHOW SAME GENDER
      if (urlCategory && product.category !== urlCategory) return false;
      
      if (urlCollection === "new") {
         if (!product.badge || (!product.badge.includes("NEW") && !product.badge.includes("TRENDING"))) return false;
      }
      if (urlCollection === "bestsellers") {
         if (product.badge !== "BESTSELLER") return false;
      }

      if (product.price > priceRange[1]) return false;
      if (!urlGender && selectedGenders.length > 0 && !selectedGenders.includes(product.gender)) return false;

      if (selectedSizes.length > 0) {
        const hasSize = product.sizes.some(s => selectedSizes.includes(s.size));
        if (!hasSize) return false;
      }
      if (selectedColors.length > 0) {
        const hasColor = product.colors.some(c => selectedColors.includes(c.name));
        if (!hasColor) return false;
      }
      if (onlyInStock && !product.inStock) return false;
      
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return -1;
      return 0; 
    });
  }, [urlCategory, urlGender, urlCollection, priceRange, selectedSizes, selectedColors, selectedGenders, onlyInStock, sortBy]);

  const sliderStyle = {
    background: `linear-gradient(to right, #1F2B5B 0%, #1F2B5B ${(priceRange[1] / 5000) * 100}%, #e5e7eb ${(priceRange[1] / 5000) * 100}%, #e5e7eb 100%)`
  };

  const renderMobileFilterContent = () => {
    // ... (keep your existing renderMobileFilterContent exactly same)
    switch (activeFilterTab) {
      case "Price":
        return (
          <div className="p-4">
            <h4 className="font-bold mb-4 text-gray-700">Max Price: ₹{priceRange[1]}</h4>
            <input type="range" min="0" max="5000" step="100" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full h-1 rounded-lg appearance-none cursor-pointer" style={sliderStyle} />
            <div className="flex justify-between text-xs text-gray-500 mt-2"><span>₹0</span><span>₹5000</span></div>
          </div>
        );
      case "Color":
        return (
          <div className="p-4 space-y-3">
            {allColors.map(color => (
              <label key={color} className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 border-gray-300 rounded text-[#1F2B5B] focus:ring-[#1F2B5B]" checked={selectedColors.includes(color)} onChange={() => toggleFilter(color, selectedColors, setSelectedColors)} />
                <span className="text-gray-700">{color}</span>
              </label>
            ))}
          </div>
        );
      case "Size":
        return (
          <div className="p-4 grid grid-cols-3 gap-3">
            {allSizes.map(size => (
              <button key={size} onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)} className={`py-2 border rounded ${selectedSizes.includes(size) ? "bg-[#1F2B5B] text-white border-[#1F2B5B]" : "border-gray-200"}`}>{size}</button>
            ))}
          </div>
        );
      case "Category":
        return (
          <div className="p-4 space-y-3">
            {["Men", "Women"].map(gender => (
              <label key={gender} className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 border-gray-300 rounded text-[#1F2B5B] focus:ring-[#1F2B5B]" checked={selectedGenders.includes(gender)} onChange={() => toggleFilter(gender, selectedGenders, setSelectedGenders)} />
                <span className="text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
        );
      case "Availability":
        return (
          <div className="p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 border-gray-300 rounded text-[#1F2B5B] focus:ring-[#1F2B5B]" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} />
              <span className="text-gray-700">In Stock Only</span>
            </label>
          </div>
        );
      default: return null;
    }
  };

  // 🔥 MEN/WOMEN LANDING PAGE WITH CATEGORIES + FEATURED PRODUCTS
  if (showCategoryLanding && currentGender) {
    const genderCategories = getGenderCategories(currentGender);
    
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-2xl md:text-5xl font-bold text-[#1F2B5B] uppercase tracking-wide mb-4">
              {currentGender}
            </h1>
            <p className="text-0xl md:text-xl text-gray-600 max-w-xl mx-auto">
              Explore our {currentGender.toLowerCase()} collection
            </p>
          </div>

          {/* 🔥 CATEGORIES GRID - SMALL CARDS (1-2 ROWS) */}
<section className="mb-20">
  <h2 className="text-2xl font-bold text-[#1F2B5B] mb-8 text-center">Shop by Category</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto">
    {genderCategories.map((col, idx) => (
      <Link 
        key={idx} 
        to={col.link}
        className="group block text-center hover:shadow-md transition-all duration-300 rounded-xl p-2 bg-white border border-gray-100 hover:border-[#1F2B5B] hover:-translate-y-1"
      >
        <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
          <img 
            src={col.image} 
            alt={col.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-[#1F2B5B] transition-colors tracking-wide line-clamp-1">
          {col.name}
        </h3>
      </Link>
    ))}
  </div>
</section>


          {/* 🔥 FEATURED PRODUCTS - SAME GENDER ONLY */}
          {featuredProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-[#1F2B5B] mb-8 flex items-center justify-between">
                <span>Featured Products</span>
                <Link to={`/products?gender=${currentGender}`} className="text-sm font-semibold hover:underline flex items-center">
                  View All → 
                </Link>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // 4️⃣ EXISTING PRODUCT LISTING (unchanged)
  return (
    <div className="min-h-screen bg-white">
      {/* Your existing product listing JSX - exactly the same as before */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8"> 
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2B5B] uppercase tracking-wide">
              {urlCollection?.replace("-", " ") || urlCategory || urlGender || "All Products"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{filteredProducts.length} Products</p>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Sort By:</span>
            <div className="relative group">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1F2B5B] cursor-pointer">
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="space-y-8 sticky top-24">
              {!urlGender && hasMixedGenders && (
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Category</h3>
                  <div className="space-y-2">{["Men", "Women"].map(gender => (<label key={gender} className="flex items-center space-x-3 cursor-pointer group"><input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-[#1F2B5B] focus:ring-[#1F2B5B]" checked={selectedGenders.includes(gender)} onChange={() => toggleFilter(gender, selectedGenders, setSelectedGenders)} /><span className="text-sm text-gray-600 group-hover:text-[#1F2B5B]">{gender}</span></label>))}</div>
                </div>
              )}

              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Price</h3>
                <input type="range" min="0" max="5000" step="100" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full h-1 rounded-lg appearance-none cursor-pointer" style={sliderStyle} />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium"><span>₹0</span><span>₹{priceRange[1]}</span></div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Size</h3>
                <div className="grid grid-cols-3 gap-2">{allSizes.map(size => (<button key={size} onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)} className={`px-3 py-2 text-sm border rounded flex items-center justify-center transition-all ${selectedSizes.includes(size) ? "border-[#1F2B5B] bg-[#1F2B5B] text-white" : "border-gray-200 text-gray-600 hover:border-[#1F2B5B]"}`}>{size}</button>))}</div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Color</h3>
                <div className="space-y-2">{allColors.map(color => (<label key={color} className="flex items-center space-x-3 cursor-pointer group"><div className={`w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center transition-colors ${selectedColors.includes(color) ? 'bg-[#1F2B5B] border-[#1F2B5B]' : 'bg-white'}`}>{selectedColors.includes(color) && <Check className="w-3 h-3 text-white" />}</div><input type="checkbox" className="hidden" checked={selectedColors.includes(color)} onChange={() => toggleFilter(color, selectedColors, setSelectedColors)} /><span className="text-sm text-gray-600 group-hover:text-[#1F2B5B]">{color}</span></label>))}</div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Availability</h3>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-[#1F2B5B] focus:ring-[#1F2B5B]" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} />
                  <span className="text-sm text-gray-600 group-hover:text-[#1F2B5B]">In Stock Only</span>
                </label>
              </div>

              <button onClick={() => {setSelectedSizes([]); setSelectedColors([]); setSelectedGenders([]); setOnlyInStock(false); setPriceRange([0,5000])}} className="text-xs text-[#1F2B5B] underline font-medium hover:text-[#F4C430]">Clear All Filters</button>
            </div>
          </aside>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-gray-500">No products match your filters.</p>
                <button onClick={() => {setSelectedSizes([]); setSelectedColors([]); setOnlyInStock(false); setPriceRange([0,5000])}} className="mt-4 text-[#1F2B5B] font-semibold hover:underline">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
                {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile footer + filters - exactly same as before */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex h-14 divide-x divide-gray-200">
          <div className="flex-1 relative flex items-center justify-center">
            <ArrowUpDown className="w-4 h-4 text-gray-600 mr-2" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-transparent text-sm font-semibold text-gray-800 focus:outline-none pr-4">
              <option value="popular">Sort: Popular</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <button onClick={() => setShowFilters(true)} className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 active:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
          <div className="relative bg-white w-full h-[65vh] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                {mobileFilterTabs.map(tab => (
                  <button key={tab} onClick={() => setActiveFilterTab(tab)} className={`w-full text-left px-4 py-4 text-sm font-medium border-l-4 transition-colors ${activeFilterTab === tab ? "bg-white border-[#1F2B5B] text-[#1F2B5B]" : "border-transparent text-gray-500 hover:bg-gray-100"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="w-2/3 bg-white overflow-y-auto">
                {renderMobileFilterContent()}
              </div>
            </div>
            <div className="p-4 border-t flex gap-3 bg-white">
              <button onClick={() => {setSelectedSizes([]); setSelectedColors([]); setSelectedGenders([]); setOnlyInStock(false); setPriceRange([0,5000])}} className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg">Clear All</button>
              <button onClick={() => setShowFilters(false)} className="flex-1 py-3 text-sm font-semibold text-white bg-[#1F2B5B] rounded-lg">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
