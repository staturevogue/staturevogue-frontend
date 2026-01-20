import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // 🔥 MAIN NAV ITEMS - FIXED (no subItems)
  const mainMenuItems = [
    { name: "Men", link: "/products?gender=Men" },
    { name: "Women", link: "/products?gender=Women" },
  ];

  const mostPopularLinks = [
    { name: "Premium Polos", link: "/products?category=Polos" },
    { name: "Street Oversize", link: "/products?category=Oversize%20T-shirts" },
    { name: "Semi Formal", link: "/products?category=Semi%20Formal%20Pants" },
    { name: "Dry Fit Active", link: "/products?category=Dry%20Fit" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="bg-[#1F2B5B] text-white text-xs sm:text-sm text-center py-1.5 tracking-wide font-medium">
        FREE SHIPPING ON ORDERS ABOVE ₹999 | EASY RETURNS
      </div>

      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 text-gray-700 hover:text-[#1F2B5B] rounded-lg hover:bg-gray-100 transition-all"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* 🔥 SMALLER Logo + Title */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1.5 group h-10 sm:h-12">
            <img src="/logo.jpeg" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain py-0.5" />
            <span className="text-lg sm:text-xl font-bold text-[#1F2B5B] tracking-tight leading-none">
              STATUREVOGUE
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 h-full items-center">
            {mainMenuItems.map((item) => (
              <Link 
                key={item.name}
                to={item.link} 
                className="text-gray-700 font-medium hover:text-[#1F2B5B] text-xs sm:text-sm uppercase tracking-wide py-1 transition-all"
              >
                {item.name}
              </Link>
            ))}
            <Link to="/products?collection=bestsellers" className="text-gray-700 font-medium hover:text-[#1F2B5B] text-xs sm:text-sm uppercase tracking-wide">Best Sellers</Link>
            <Link to="/products?collection=new" className="text-gray-700 font-medium hover:text-[#1F2B5B] text-xs sm:text-sm uppercase tracking-wide">New Arrivals</Link>
          </div>

          {/* 🔥 SEARCH + SMALLER ICONS */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search - WORKING */}
            <div className="relative">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-[#1F2B5B] rounded-lg hover:bg-gray-100 transition-all"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {showSearch && (
                <form onSubmit={handleSearch} className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-xl border p-2 w-64 sm:w-72 z-50">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full p-2.5 text-sm border-none outline-none rounded-lg focus:ring-1 focus:ring-[#1F2B5B]"
                    autoFocus
                  />
                </form>
              )}
            </div>

            <Link to="/login" className="text-gray-600 hover:text-[#1F2B5B] p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-[#1F2B5B] p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4C430] text-[#1F2B5B] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU - Smaller Text */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-white">
          <div className="h-screen flex flex-col pt-4 px-4 sm:px-6 overflow-y-auto">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="self-end p-2 mb-6 rounded-full hover:bg-gray-100 transition-all"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="space-y-1 mb-8">
              <Link 
                to="/products?gender=Men"
                className="block py-3 px-3 text-lg sm:text-xl font-bold text-gray-900 hover:text-[#1F2B5B] border-l-4 border-transparent hover:border-[#1F2B5B] rounded-r-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Men
              </Link>
              <Link 
                to="/products?gender=Women"
                className="block py-3 px-3 text-lg sm:text-xl font-bold text-gray-900 hover:text-[#1F2B5B] border-l-4 border-transparent hover:border-[#1F2B5B] rounded-r-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Women
              </Link>
            </div>

            <div className="border-t pt-6 space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#1F2B5B] mb-4 px-1 tracking-wide uppercase">Most Popular</h3>
              {mostPopularLinks.map((item) => (
                <Link 
                  key={item.name}
                  to={item.link}
                  className="block py-2.5 px-3 text-base sm:text-lg font-semibold text-gray-700 hover:text-[#1F2B5B] hover:bg-gray-50 rounded-lg transition-all border-l-2 border-transparent hover:border-[#1F2B5B] ml-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
