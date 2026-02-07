import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, User, ChevronDown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { storeService } from "../../services/api";

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [menCategories, setMenCategories] = useState<any[]>([]);
  const [womenCategories, setWomenCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  
  // ✅ DEFAULT ANNOUNCEMENT
  const [announcement, setAnnouncement] = useState("FREE SHIPPING ON ORDERS OVER ₹999 | EASY RETURNS");

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [catsData, colsData, contentData] = await Promise.all([
          storeService.getCategories(),
          storeService.getCollections(),
          storeService.getWebContent() 
        ]);
        
        const allCats = catsData.results || catsData;
        const allCols = colsData.results || colsData;

        setMenCategories(allCats.filter((c: any) => c.gender === 'Men' || c.gender === 'All'));
        setWomenCategories(allCats.filter((c: any) => c.gender === 'Women' || c.gender === 'All'));
        setCollections(allCols);

        // ✅ Update ONLY if dynamic content exists
        if (contentData.announcement && contentData.announcement.text) {
            setAnnouncement(contentData.announcement.text);
        }

      } catch (error) {
        console.error("Menu data error", error);
      }
    };
    fetchMenuData();
  }, []);

  // ... (Keep remaining logic: handleSearch, toggleMobileSubmenu, useEffect for focus, return statement) ...
  // (Paste the rest of your Header.tsx render logic here, it is unchanged)
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
        setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
    }
  }, [isMobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };

  const toggleMobileSubmenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-40 border-b border-gray-100 font-sans">
      
      {/* Promotion Bar */}
      <div className="bg-[#1F2B5B] text-white text-[10px] sm:text-xs py-2 text-center tracking-widest font-medium px-4">
        {announcement}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 md:h-20">
          
          {/* --- LEFT: Mobile Menu Button --- */}
          <div className="flex items-center md:hidden z-20">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="p-2 -ml-2 text-gray-700 hover:text-[#1F2B5B]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 
              absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
              md:static md:translate-x-0 md:translate-y-0 md:flex-shrink-0 z-10">
               <img 
                 src="/logo.jpeg" 
                 alt="Logo" 
                 className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover" 
               />
               <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter text-[#1F2B5B] uppercase whitespace-nowrap">
                 STATURE VOGUE
               </span>
          </Link>

          {/* --- CENTER: Desktop Navigation --- */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 ml-8">
            <Link
  to="/products?badge=NEW"
  className="text-sm font-medium text-gray-700 hover:text-[#1F2B5B] uppercase tracking-wide whitespace-nowrap"
>
  New Arrivals
</Link>



            {/* MEN */}
            <div className="relative group h-20 flex items-center">
              <Link to="/products?gender=Men" className="text-sm font-medium text-gray-700 hover:text-[#1F2B5B] uppercase tracking-wide flex items-center gap-1">
                Men <ChevronDown className="w-3 h-3 opacity-50" />
              </Link>
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-[#1F2B5B] overflow-hidden">
                <div className="py-2">
                  <Link to="/products?gender=Men" className="block px-4 py-2 text-sm font-bold text-[#1F2B5B] hover:bg-gray-50">Shop All Men</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  {menCategories.map((cat) => (
                    <Link key={cat.id} to={`/products?gender=Men&category=${cat.name}`} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1F2B5B] hover:bg-gray-50">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* WOMEN */}
            <div className="relative group h-20 flex items-center">
              <Link to="/products?gender=Women" className="text-sm font-medium text-gray-700 hover:text-[#1F2B5B] uppercase tracking-wide flex items-center gap-1">
                Women <ChevronDown className="w-3 h-3 opacity-50" />
              </Link>
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-[#1F2B5B] overflow-hidden">
                <div className="py-2">
                  <Link to="/products?gender=Women" className="block px-4 py-2 text-sm font-bold text-[#1F2B5B] hover:bg-gray-50">Shop All Women</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  {womenCategories.map((cat) => (
                    <Link key={cat.id} to={`/products?gender=Women&category=${cat.name}`} className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1F2B5B] hover:bg-gray-50">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* COLLECTIONS */}
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

          {/* --- RIGHT ACTIONS --- */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto md:ml-0 z-20">
            {/* Desktop Search */}
            <div className="hidden md:block w-full max-w-[200px] lg:max-w-[260px]">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full py-2 pl-3 pr-8 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#1F2B5B] focus:ring-1 focus:ring-[#1F2B5B] transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1F2B5B]">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} 
              className="md:hidden p-1 text-gray-700 hover:text-[#1F2B5B] transition-colors"
            >
              {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Profile */}
            <Link to="/user" className="p-1 text-gray-700 hover:text-[#1F2B5B] transition-colors hidden md:block">
              <User className="w-5 h-5" />
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="p-1 text-gray-700 hover:text-[#1F2B5B] transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4C430] text-[#1F2B5B] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* --- MOBILE SEARCH DROPDOWN --- */}
      {isMobileSearchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-t border-gray-100 bg-white p-4 shadow-lg animate-in slide-in-from-top-2 z-30">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full py-3 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#1F2B5B] focus:ring-1 focus:ring-[#1F2B5B]"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* --- MOBILE MENU --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative bg-white w-[85%] max-w-[320px] h-full shadow-2xl overflow-y-auto animate-slide-right flex flex-col">
            
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <span className="font-bold text-lg text-[#1F2B5B] tracking-tight">MENU</span>
              <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>

            <div className="flex-1 p-5 space-y-2">
              
              <Link 
                to="/user" 
                className="flex items-center gap-3 py-3 font-bold text-[#1F2B5B] border-b-2 border-[#1F2B5B] mb-4 bg-blue-50/50 -mx-5 px-5" 
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" /> 
                <span>My Orders & Account</span>
              </Link>

                         <Link
  to="/products?badge=NEW"
  className="text-sm font-medium text-gray-700 hover:text-[#1F2B5B] uppercase tracking-wide whitespace-nowrap"
>
  New Arrivals
</Link>
              
              {/* Men Mobile */}
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

              {/* Women Mobile */}
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

              <Link to="/products?badge=BESTSELLER" className="block py-3 font-medium text-gray-800 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
                Best Sellers
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}