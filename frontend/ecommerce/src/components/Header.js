import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  Package,
  Heart,
  X,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { useWishlist } from "../context/WishListContext";
import { useApi } from "../api";
import logo from "../logo/shopzone-logo (1).svg";



function Header() {
  const { user, logout } = useContext(AuthContext);
  const { getProducts } = useApi();
  const { search, setSearch } = useContext(SearchContext);
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const categories = [
    { label: "Men", value: "Men", type: "mainCategory" },
    { label: "Women", value: "women", type: "mainCategory" },
    { label: "Children", value: "Children", type: "mainCategory" },
    { label: "Mobiles", value: "Mobiles", type: "subcategory" },
    { label: "Fashion", value: "Fashion", type: "mainCategory" },
    { label: "Electronics", value: "Electronics", type: "mainCategory" },
    { label: "Home & Living", value: "Home & Living", type: "mainCategory" },
    { label: "Sports & Fitness", value: "Sports & Fitness", type: "mainCategory" },
    { label: "Books", value: "Books & Media", type: "mainCategory" },
  ];

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?search=${search}`);
    setShowSuggestions(false);
  };

  //  Memoized fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await getProducts({ search: searchTerm, limit: 6 });
      if (res?.success && res.products?.length) {
        setSuggestions(res.products.slice(0, 6));
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching search suggestions:", err);
      setSuggestions([]);
    }
  }, [getProducts]);

  useEffect(() => {
    const delay = setTimeout(() => fetchSuggestions(search), 300);
    return () => clearTimeout(delay);
  }, [search, fetchSuggestions]);

  //  Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search suggestions
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      // Close user menu
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Auto-close dropdown after navigation
  const handleNavigate = (path) => {
    navigate(path);
    setIsUserMenuOpen(false); 
    setIsMenuOpen(false); 
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearch("");
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Navbar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto flex items-center h-12 sm:h-14 px-3 sm:px-4">
      
          <Link
            to="/"
            className="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4"
            onClick={() => setSearch("")}
          >
            <img 
              src={logo} 
              alt="ShopZone Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
            <span className="text-base sm:text-lg font-bold text-purple-400 hidden md:inline">
              ShopZone
            </span>
          </Link>

          {/* 🔍 Search Bar with Smart Suggestions */}
          <div className="flex-1 mx-1 sm:mx-2 relative" ref={searchRef}>
            <div className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 text-sm sm:text-base flex-1 text-black rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={handleSearch}
                className="bg-purple-400 px-2 sm:px-3 md:px-4 rounded-r-md hover:bg-indigo-500 transition"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              </button>
            </div>

            {/* 🧠 Suggestion Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full bg-white text-gray-800 rounded-md shadow-xl mt-1 z-50 max-h-60 sm:max-h-72 overflow-y-auto border border-gray-200">
                <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-500 font-medium">Suggestions</span>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSuggestionClick(item._id)}
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                  >
                    <img
                      src={item.image?.[0] || "/placeholder.png"}
                      alt={item.name}
                      loading="lazy"
                      className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-xs sm:text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account / Login / Cart / Wishlist */}
          <div className="ml-2 sm:ml-4 md:ml-6 flex items-center gap-2 sm:gap-3 md:gap-4 relative">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm hover:text-yellow-400 transition"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Hello, {user.name}</span>
                  <span className="sm:hidden">Hi</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white text-gray-700 shadow-xl rounded-md overflow-hidden z-50 border border-gray-200">
                    {user.role === "admin" ? (
                      //  Admin Menu
                      <>
                        <button
                          onClick={() => handleNavigate("/admin/dashboard")}
                          className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm"
                        >
                          📊 Admin Dashboard
                        </button>
                        <button
                          onClick={() => handleNavigate("/admin/create-product")}
                          className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm"
                        >
                          ➕ Create Product
                        </button>
                        <button
                          onClick={() => handleNavigate("/admin/orders")}
                          className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm"
                        >
                          📦 Manage Orders
                        </button>
                        <button
                          onClick={() => handleNavigate("/admin/products")}
                          className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm"
                        >
                          🛍️ Manage Products
                        </button>
                        <button
                          onClick={() => handleNavigate("/admin/users")}
                          className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm"
                        >
                          👥 Manage Users
                        </button>
                      </>
                    ) : (
                      //  User Menu (No Orders for Admin)
                      <button
                        onClick={() => handleNavigate("/orders")}
                        className="w-full text-left px-3 sm:px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition text-sm"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </button>
                    )}

                    <hr className="my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 sm:px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 transition text-sm"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-2 sm:px-3 py-1 rounded-md bg-yellow-400 text-black text-xs sm:text-sm font-medium hover:bg-yellow-500 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-block px-3 py-1 rounded-md border border-yellow-400 text-yellow-400 text-sm font-medium hover:bg-yellow-500 hover:text-black transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link 
              to="/wishlist" 
              className="relative flex items-center hover:text-pink-500 transition group"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:fill-pink-500 transition" />
              <span className="font-bold hidden lg:inline ml-1 text-sm">Wishlist</span>
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-3 bg-pink-500 text-white text-[10px] sm:text-xs font-bold rounded-full px-1 sm:px-2 py-0.5 animate-pulse">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            <Link 
              to="/cart" 
              className="flex items-center hover:text-yellow-400 transition group"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
              <span className="font-bold hidden lg:inline ml-1 text-sm">Cart</span>
            </Link>

            <button 
              className="ml-1 sm:ml-2 md:ml-4 md:hidden hover:text-yellow-400 transition" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navbar */}
      <div className="bg-gray-800 text-gray-200 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 md:gap-6 h-9 sm:h-10 px-3 sm:px-4 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => handleNavigate(`/category/${cat.value}?type=${cat.type}`)}
              className="hover:text-yellow-400 transition whitespace-nowrap"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white px-3 sm:px-4 py-3 animate-slide-down">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => handleNavigate(`/category/${cat.value}?type=${cat.type}`)}
              className="block w-full text-left hover:text-yellow-400 py-2 transition text-sm"
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default React.memo(Header);