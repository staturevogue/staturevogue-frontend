import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, User, ChevronDown, ChevronRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { storeService } from "../../services/api";

export default function Header() {
  // 🔥 FIX 1: Use getCartCount function, then call it to get the number
  const { getCartCount } = useCart();
  const cartCount = getCartCount(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // --- 1. DATA STATE ---
  const [menCategories, setMenCategories] = useState<any[]>([]);
  const [womenCategories, setWomenCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  
  // Mobile Accordion State
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [catsData, colsData] = await Promise.all([
          storeService.getCategories(),
          storeService.getCollections()
        ]);

        const allCats = catsData.results || catsData;
        const allCols = colsData.results || colsData;

        // 🔥 DEBUG: Check console to see if gender is actually 'Men' or 'Women' in your DB
        console.log("All Categories:", allCats); 

        // Filter Categories
        setMenCategories(allCats.filter((c: any) => c.gender === 'Men' || c.gender === 'All'));
        setWomenCategories(allCats.filter((c: any) => c.gender === 'Women' || c.gender === 'All'));
        
        setCollections(allCols);
      } catch (error) {
        console.error("Failed to load menu data", error);
      }
    };
    fetchMenuData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const toggleMobileSubmenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      
      {/* Promotion Bar */}
      <div className="bg-[#1F2B5B] text-white text-[10px] sm:text-xs py-2 text-center tracking-widest font-medium px-4">
        FREE SHIPPING ON ORDERS OVER ₹999 | EASY RETURNS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 md:hidden text-gray-700 hover:text-[#1F2B5B]">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-[#1F2B5B] uppercase">
            STATURE VOGUE
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <nav className="hidden md:flex items-center space-x-8">
            
            {/* 1. NEW ARRIVALS (Direct Link) */}
            <Link to="/products?badge=NEW" className="text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-wide">
              New Arrivals
            </Link>

            {/* 2. MEN DROPDOWN */}
            <div className="relative group h-20 flex items-center">
              <Link to="/products?gender=Men" className="text-sm font-medium text-gray-700 hover:text-[#1F2B5B] uppercase tracking-wide flex items-center gap-1">
                Men <ChevronDown className="w-3 h-3 opacity-50" />
              </Link>
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-[#1F2B5B] overflow-hidden">
                <div className="py-2">
                  <Link to="/products?gender=Men" className="block px-4 py-2 text-sm font-bold text-[#1F2B5B] hover:bg-gray-50">Shop All Men</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  {menCategories.length > 0 ? (
                    menCategories.map((cat) => (
                      <Link key={cat.id} to={`/products?gender=Men&category=${cat.name}`} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1F2B5B] hover:bg-gray-50">
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-xs text-gray-400 italic">No categories found</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. WOMEN DROPDOWN */}
            <div className="relative group h-20 flex items-center">
              <Link to="/products?gender=Women" className="text-sm font-medium text-gray-700 hover:text-[#1F2B5B] uppercase tracking-wide flex items-center gap-1">
                Women <ChevronDown className="w-3 h-3 opacity-50" />
              </Link>
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-[#1F2B5B] overflow-hidden">
                <div className="py-2">
                  <Link to="/products?gender=Women" className="block px-4 py-2 text-sm font-bold text-[#1F2B5B] hover:bg-gray-50">Shop All Women</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  {womenCategories.length > 0 ? (
                    womenCategories.map((cat) => (
                      <Link key={cat.id} to={`/products?gender=Women&category=${cat.name}`} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1F2B5B] hover:bg-gray-50">
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-xs text-gray-400 italic">No categories found</span>
                  )}
                </div>
              </div>
            </div>

            {/* 4. COLLECTIONS DROPDOWN */}
            <div className="relative group h-20 flex items-center">
              <span className="text-sm font-medium text-gray-700 hover:text-[#1F2B5B] uppercase tracking-wide cursor-pointer flex items-center gap-1">
                Collections <ChevronDown className="w-3 h-3 opacity-50" />
              </span>
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-[#1F2B5B] overflow-hidden">
                <div className="py-2">
                  <Link to="/products?badge=BESTSELLER" className="block px-4 py-2 text-sm font-medium text-gray-900 hover:text-[#1F2B5B] hover:bg-gray-50">Best Sellers</Link>
                  {collections.map((col) => (
                    <Link key={col.id} to={`/products?collection=${col.slug}`} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1F2B5B] hover:bg-gray-50">
                      {col.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1 text-gray-700 hover:text-[#1F2B5B] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/user" className="p-1 text-gray-700 hover:text-[#1F2B5B] transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="p-1 text-gray-700 hover:text-[#1F2B5B] transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {/* 🔥 FIX 2: Use cartCount derived variable */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4C430] text-[#1F2B5B] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg animate-fade-in">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-gray-400"
                autoFocus
              />
              <button type="button" onClick={() => setIsSearchOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </form>
          </div>
        )}
      </div>

      {/* --- MOBILE MENU (ACCORDION STYLE) --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative bg-white w-[85%] max-w-[320px] h-full shadow-2xl overflow-y-auto animate-slide-right flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <span className="font-bold text-lg text-[#1F2B5B] tracking-tight">MENU</span>
              <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            
            {/* Links */}
            <div className="flex-1 p-5 space-y-2">
              
              {/* 1. New Arrivals */}
              <Link to="/products?badge=NEW" className="block py-3 font-bold text-red-600 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
                NEW ARRIVALS
              </Link>

              {/* 2. Men Accordion */}
              <div>
                <button onClick={() => toggleMobileSubmenu('men')} className="w-full py-3 flex justify-between items-center font-bold text-gray-800 border-b border-gray-100">
                  MEN <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'men' ? 'rotate-180' : ''}`} />
                </button>
                {expandedMenu === 'men' && (
                  <div className="pl-4 py-2 bg-gray-50 space-y-2">
                    <Link to="/products?gender=Men" className="block py-2 text-sm font-semibold text-[#1F2B5B]" onClick={() => setIsMenuOpen(false)}>Shop All Men</Link>
                    {menCategories.map((cat) => (
                      <Link key={cat.id} to={`/products?gender=Men&category=${cat.name}`} className="block py-2 text-sm text-gray-600" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Women Accordion */}
              <div>
                <button onClick={() => toggleMobileSubmenu('women')} className="w-full py-3 flex justify-between items-center font-bold text-gray-800 border-b border-gray-100">
                  WOMEN <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'women' ? 'rotate-180' : ''}`} />
                </button>
                {expandedMenu === 'women' && (
                  <div className="pl-4 py-2 bg-gray-50 space-y-2">
                    <Link to="/products?gender=Women" className="block py-2 text-sm font-semibold text-[#1F2B5B]" onClick={() => setIsMenuOpen(false)}>Shop All Women</Link>
                    {womenCategories.map((cat) => (
                      <Link key={cat.id} to={`/products?gender=Women&category=${cat.name}`} className="block py-2 text-sm text-gray-600" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Best Sellers & Collections */}
              <Link to="/products?badge=BESTSELLER" className="block py-3 font-medium text-gray-800 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
                Best Sellers
              </Link>
              {collections.map((col) => (
                 <Link key={col.id} to={`/products?collection=${col.slug}`} className="block py-3 font-medium text-gray-800 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
                   {col.title}
                 </Link>
              ))}

            </div>

            {/* Footer Links */}
            <div className="p-5 bg-gray-50 border-t">
               <Link to="/user" className="flex items-center gap-2 font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>
                 <User className="w-5 h-5" /> My Account
               </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}