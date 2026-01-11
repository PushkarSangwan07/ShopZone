import React, { useCallback, useEffect, useState, useMemo, memo } from "react";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify"
import { useApi } from "../api";
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

//  Memoize HeroBanner to prevent re-renders
const HeroBanner = memo(({
  heroBanners,
  currentBanner,
  setCurrentBanner,
  isAutoPlaying,
  setIsAutoPlaying,
  isTransitioning,
  setIsTransitioning
}) => {
  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [isTransitioning, heroBanners.length, setCurrentBanner, setIsTransitioning]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [isTransitioning, heroBanners.length, setCurrentBanner, setIsTransitioning]);

  const goToSlide = useCallback((index) => {
    if (!isTransitioning && index !== currentBanner) {
      setIsTransitioning(true);
      setCurrentBanner(index);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [isTransitioning, currentBanner, setCurrentBanner, setIsTransitioning]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  return (
    <div
      className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className="flex transition-transform duration-1000 ease-out h-full"
        style={{ transform: `translateX(-${currentBanner * 100}%)` }}
      >
        {heroBanners.map((banner, index) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <div
              className="h-full bg-cover bg-center transition-transform duration-2000"
              style={{
                backgroundImage: `url(${banner.image})`,
                transform: index === currentBanner ? 'scale(1.01)' : 'scale(1)'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${banner.color} opacity-80`}></div>

              {banner.particles && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-white w-full">
                  <div className="max-w-3xl">
                    <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 sm:mb-4 md:mb-6 transition-all duration-1000 ${index === currentBanner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      }`}>
                      <span className={`bg-gradient-to-r ${banner.accent} bg-clip-text text-transparent`}>
                        {banner.title}
                      </span>
                    </h1>

                    <h2 className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 transition-all duration-1000 delay-200 ${index === currentBanner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      }`}>
                      {banner.subtitle}
                    </h2>

                    <p className={`text-sm sm:text-base md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-10 text-gray-100 transition-all duration-1000 delay-400 ${index === currentBanner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      }`}>
                      {banner.description}
                    </p>

                    <div className={`flex space-x-2 sm:space-x-4 transition-all duration-1000 delay-600 ${index === currentBanner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      }`}>
                      <button className={`group relative bg-gradient-to-r ${banner.accent} text-gray-900 px-4 py-2 sm:px-6 sm:py-3 md:px-10 md:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 active:scale-95 overflow-hidden`}>
                        <span className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                          <span>{banner.buttonText}</span>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute top-20 right-20 opacity-10">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-white to-transparent animate-pulse"></div>
              </div>
              <div className="hidden md:block absolute bottom-32 right-32 opacity-5">
                <div className="w-64 h-64 rounded-full bg-gradient-to-l from-white to-transparent animate-bounce"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} disabled={isTransitioning} className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-110 disabled:opacity-50 group-hover:opacity-100 opacity-50 md:opacity-0 border border-white/20">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button onClick={nextSlide} disabled={isTransitioning} className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-110 disabled:opacity-50 group-hover:opacity-100 opacity-50 md:opacity-0 border border-white/20">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 md:space-x-4 z-20">
        {heroBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/30 ${index === currentBanner ? 'w-8 sm:w-12 md:w-16 h-2 sm:h-3 md:h-4 bg-white shadow-xl' : 'w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 bg-white/50 hover:bg-white/70 hover:scale-110'
              }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 md:h-2 bg-white/10 z-20">
        <div
          className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 transition-all duration-1000 shadow-lg"
          style={{ width: `${((currentBanner + 1) / heroBanners.length) * 100}%` }}
        />
      </div>

      <div className="absolute top-2 sm:top-4 md:top-8 right-2 sm:right-4 md:right-8 z-20 bg-black/20 backdrop-blur-xl text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-lg font-semibold border border-white/20">
        {String(currentBanner + 1).padStart(2, '0')} / {String(heroBanners.length).padStart(2, '0')}
      </div>
    </div>
  );
});

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search, setSearch, category, setCategory } = useContext(SearchContext);
  const { getProducts, updateProduct, fetchFlashDeals } = useApi();

  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flashDeals, setFlashDeals] = useState([]);


  


  //     Memoize hero banners (created once)
  const heroBanners = useMemo(() => [
    {
      id: 1,
      title: "LUXURY REDEFINED",
      subtitle: "Curated Premium Collections",
      description: "Handpicked by experts • Exclusive limited editions • Premium quality",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop&q=80",
      color: "from-rose-500 via-pink-600 to-purple-800",
      accent: "from-amber-400 to-orange-500",
      particles: false,
      buttonText: "Shop Now"
    },
    {
      id: 2,
      title: "SUSTAINABLE FUTURE",
      subtitle: "Eco-Conscious Shopping",
      description: "Carbon-neutral delivery • Sustainable packaging • Green initiatives",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1400&h=600&fit=crop",
      color: "from-emerald-500 via-green-600 to-teal-800",
      accent: "from-lime-400 to-green-500",
      particles: true,
      buttonText: "Explore"
    },

   {
      id: 3,
      title: "TECH REVOLUTION",
      subtitle: "Next-Gen Gadgets & Innovation",
      description: "Latest technology • Smart devices • Future-ready solutions",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=700&fit=crop",
      particles: true
    }
    ,
    {
      id: 4,
      title: "LIFESTYLE COLLECTION",
      subtitle: "Curated Living Essentials",
      description: "Home & lifestyle • Premium quality • Designer collections",
      image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1600&h=700&fit=crop",
      particles: false
    }
  ], []);

  //     Fetch products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [getProducts]); //     Empty deps - runs once

  const loadFlashDeals = useCallback(async () => {
    try {
      const data = await fetchFlashDeals();
      // console.log("🔍 Flash Deals from server:", data);
      if (data.success) setFlashDeals(data.flashDeals);
    } catch (err) {
      console.error("❌ Error loading flash deals:", err);
    }
  }, [fetchFlashDeals]);

  useEffect(() => {
    loadFlashDeals();
  }, [loadFlashDeals]);

  const handleChange = useCallback((dealId, field, value) => {
    setFlashDeals(prevDeals =>
      prevDeals.map(d =>
        d._id === dealId
          ? {
            ...d,
            [field]: field === "flashDealPrice" || field === "price" ? Number(value) : value
          }
          : d
      )
    );
  }, []);

  const handleSaveFlashDeal = useCallback(async (deal) => {
    if (!user || user.role !== "admin") {
      toast.error("❌ Unauthorized: Admins only");
      return;
    }
    if (!deal.expiry) {
      toast.error("❌ Please set a valid expiry date for the flash deal");
      return;
    }
    if (!deal.productId) {
      toast.warn("⚠️ Select a product before saving the deal.");
      return;
    }

    const product = products.find((p) => p._id === deal.productId);
    if (!product) {
      toast.error("❌ Selected product not found");
      return;
    }

    const updatedData = {
      price: deal.price,
      isFlashDeal: true,
      flashDealPrice: deal.flashDealPrice,
      flashDealExpiry: new Date(deal.expiry).toISOString(),
      discount: deal.discount || 0,
      image: deal.image || product.image,
    };

    try {
      const res = await updateProduct(deal.productId, updatedData, user.jwttok);
      if (res.success) {
        toast.success("    Flash deal saved successfully!");
        await loadFlashDeals();
      } else {
        toast.error(res.message || "❌ Failed to save flash deal");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error saving flash deal");
    }
  }, [user, products, updateProduct, loadFlashDeals]);

  const handleAddNewDeal = useCallback(() => {
    // console.log("Add Deal Clicked");
    if (!products.length) return toast.info("ℹ️ No products available yet");
    // alert("No products available");

    setFlashDeals((prev) => [
      ...prev,
      {
        id: Date.now(),
        productId: "",
        title: "New Deal",
        price: 0,
        discount: 0,
        image: "https://picsum.photos/400/300?random=" + Math.floor(Math.random() * 100),
        expiry: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
    ]);
  }, [products.length]);



useEffect(() => {
  const tick = () => {
    const now = Date.now();

    setFlashDeals((prevDeals) => {
      const activeDeals = prevDeals.filter((deal) => {
        if (!deal.flashDealExpiry) return true;
        return new Date(deal.flashDealExpiry).getTime() > now;
      });

      if (activeDeals.length < prevDeals.length) {
        const expiredCount = prevDeals.length - activeDeals.length;
        toast.error(
          `🕐 ${expiredCount} flash deal${expiredCount > 1 ? "s" : ""} expired!`
        );
      }

      // ⏱ Calculate time left safely
      const validDeals = activeDeals.filter(d => d.flashDealExpiry);

      if (validDeals.length > 0) {
        const earliestExpiry = Math.min(
          ...validDeals.map(d => new Date(d.flashDealExpiry).getTime())
        );

        const distance = earliestExpiry - now;

        setTimeLeft(
          distance <= 0
            ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
            : {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((distance / (1000 * 60)) % 60),
                seconds: Math.floor((distance / 1000) % 60),
              }
        );
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }

      return activeDeals;
    });
  };

  tick();
  const interval = setInterval(tick, 1000);
  return () => clearInterval(interval);
}, []); //     NO LOOP




  //     Memoize filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? product.category === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  //     Memoize categories
  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const getProductsByCategory = useCallback((cat) => products.filter((p) => p.category === cat).slice(0, 4), [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-20 w-20 border-4 border-purple-300 border-opacity-30 mx-auto"></div>
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            Loading amazing products...
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Banner */}
      <HeroBanner
        heroBanners={heroBanners}
        currentBanner={currentBanner}
        setCurrentBanner={setCurrentBanner}
        isAutoPlaying={isAutoPlaying}
        setIsAutoPlaying={setIsAutoPlaying}
        isTransitioning={isTransitioning}
        setIsTransitioning={setIsTransitioning}
      />

      {/* Flash Deals Section - ALL ORIGINAL LOGIC KEPT */}
      <div className="bg-gray-100 py-8 sm:py-12 md:py-16 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4">
                <span className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ⚡
                </span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Flash Deals</span>
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
                Limited time offers • Exclusive discounts • Premium quality guaranteed
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white rounded-2xl sm:rounded-3xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 shadow-md border border-gray-200">
              <span className="text-gray-800 text-sm sm:text-base md:text-lg font-medium">Ends in</span>
              <div className="flex space-x-2 sm:space-x-3">
                {["days", "hours", "minutes", "seconds"].map((unit) => (
                  <div key={unit} className="text-center">
                    <span className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 bg-gray-200 rounded-xl sm:rounded-2xl shadow block">
                      {String(timeLeft[unit]).padStart(2, "0")}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm mt-1 block">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleAddNewDeal}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                ➕ Add New Deal
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {flashDeals.map((deal) => {
              const discountPercentage =
                deal.price && deal.flashDealPrice && deal.flashDealPrice < deal.price
                  ? Math.round((1 - deal.flashDealPrice / deal.price) * 100)
                  : 0;

              const badges = [];
              if (deal.stock <= 5) badges.push("Limited Stock");
              const daysSinceCreation = (new Date() - new Date(deal.createdAt)) / (1000 * 60 * 60 * 24);
              if (daysSinceCreation <= 7) badges.push("New");
              if (deal.sales >= 50) badges.push("Best Seller");

              const badgeColors = ["bg-yellow-400 text-gray-900", "bg-green-400 text-white", "bg-orange-400 text-white"];

              return (


                <div
                  key={deal._id}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-500 border border-gray-200 flex flex-col h-full"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={deal.image || "https://via.placeholder.com/400x300"}
                      alt={deal.name || "Deal Image"}
                      loading="lazy"
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {discountPercentage > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
                        -{discountPercentage}%
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex flex-col gap-1">
                      {badges.map((badge, i) => (
                        <span key={i} className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${badgeColors[i % badgeColors.length]}`}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Product Info - Fixed Height */}
                    <div className="flex-grow">
                      <h4 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2 min-h-[56px]">
                        {deal.name}
                      </h4>

                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl font-black text-red-500">
                          ₹{deal.flashDealPrice || deal.price || 0}
                        </span>
                        {discountPercentage > 0 && (
                          <span className="text-gray-400 line-through">
                            ₹{deal.price}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center mb-2 space-x-1">
                        <span className="text-yellow-400 font-bold">★</span>
                        <span className="text-gray-700 font-medium">{deal.rating || 4.5} / 5</span>
                      </div>
                    </div>

                    { /* Admin Controls or Buy Button - Always at Bottom */ }
                      <div className="mt-auto">
                      {user?.role === "admin" && (
                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                          <select
                            value={deal.productId || ""}
                            onChange={(e) => handleChange(deal._id, "productId", e.target.value)}
                            className="w-full p-2 border rounded bg-white"
                            required
                          >
                            <option value="">-- Select Product --</option>
                            {products.map((p) => (
                              <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                          </select>

                          <input
                            type="number"
                            placeholder="Discounted Price"
                            value={deal.flashDealPrice || ""}
                            onChange={(e) => handleChange(deal._id, "flashDealPrice", e.target.value)}
                            className="w-full p-2 border rounded bg-white"
                            required
                          />

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Deal Expires On:
                            </label>
                            <input
                              type="datetime-local"
                              value={deal.expiry ? new Date(deal.expiry).toISOString().slice(0, 16) : ""}
                              onChange={(e) => handleChange(deal._id, "expiry", e.target.value)}
                              className="w-full p-2 border rounded bg-white text-sm"
                              required
                            />
                          </div>

                          <input
                            type="text"
                            placeholder="Image URL"
                            value={deal.image || ""}
                            onChange={(e) => handleChange(deal._id, "image", e.target.value)}
                            className="w-full p-2 border rounded bg-white"
                          />

                          <button
                            onClick={() => handleSaveFlashDeal(deal)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
                          >
                            💾 Save Flash Deal
                          </button>
                          <button
                            onClick={() => setFlashDeals(prev => prev.filter(d => d._id !== deal._id))}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
                          >
                            🗑️ Remove Deal
                          </button>
                        </div>
                      )}

                      {user?.role !== "admin" && (
                        <button
                          onClick={() => navigate(`/product/${deal._id}`)}
                          className="w-full bg-yellow-500 text-gray-900 py-3 rounded-2xl font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          🛒 Grab Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>


              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-gray-800 mb-2 flex items-center">
                🔥 <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-3">Featured Products</span>
              </h2>
              <p className="text-gray-600 text-lg">Handpicked by our experts • Premium quality • Trending now</p>
            </div>
           
          </div>

          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-8 pb-6" style={{ width: 'max-content' }}>
                {filteredProducts.slice(0, 6).map((product) => (
                  <div key={product._id} className="w-80 flex-shrink-0">
                    <ProductCard product={product} featured={true}
                    />


                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {categories.map((cat) => {
          const categoryProducts = getProductsByCategory(cat);
          if (categoryProducts.length === 0) return null;

          const categoryIcons = {
            'Electronics': '📱',
            'Fashion': '👗',
            'Home': '🏠',
            'Sports': '⚽',
            'Books': '📚'
          };

          return (
            <section key={cat} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
                    <span className="text-4xl mr-3">{categoryIcons[cat] || '🛍️'}</span>
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{cat}</span>
                    <span className="ml-4 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl font-medium shadow-lg">
                      {products.filter(p => p.category === cat).length} items
                    </span>
                  </h2>
                  <p className="text-gray-600">Discover amazing products in {cat.toLowerCase()}</p>
                </div>
                
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categoryProducts.map((product) => (
                  <div key={product._id} className="transform hover:scale-105 transition-all duration-500">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {(search || category) && (
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  🔍 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Search Results</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  {search && ` for "${search}"`}
                  {category && ` in ${category}`}
                </p>
              </div>
              {(search || category) && (
                <button
                  onClick={() => { setSearch(""); setCategory(""); }}
                  className="group bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="transform hover:scale-105 transition-all duration-500">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="text-8xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-4xl font-bold text-gray-800 mb-4">No Products Found</h3>
                <p className="text-gray-600 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
                  We couldn't find any products matching your search criteria.
                  {search.trim() && ` Try searching for "${search.trim()}" `}
                  {category && ` in ${category} category `}
                  or explore our other amazing collections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => { setSearch(""); setCategory(""); }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    🔄 Clear Search
                  </button>
                  <button className="border-2 border-purple-600 text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all">
                    Browse All Products
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-5xl font-black mb-4 flex items-center justify-center gap-4">
              📧 <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Stay Updated!</span>
            </h3>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Get exclusive deals, early access to sales, and personalized recommendations delivered straight to your inbox. Join over 100,000+ happy shoppers!
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-2xl text-gray-800 bg-white focus:ring-4 focus:ring-yellow-400/50 font-medium text-lg placeholder-gray-500"
              />
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-white/70 text-sm mt-4">
              ✨ No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>



      <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 md:py-16 relative">
        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute -top-6 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          title="Back to Top"
        >
          <svg
            className="w-6 h-6 group-hover:-translate-y-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <h4 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 flex items-center">
                ✨ <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent ml-3">ShopZone</span>
              </h4>
              <p className="text-gray-300 mb-4 md:mb-6 text-base md:text-lg leading-relaxed max-w-md">
                Your premium destination for amazing products at unbeatable prices. We're revolutionizing online shopping with AI-powered recommendations and lightning-fast delivery.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                
              </div>
            </div>

            <div>
              <h5 className="font-bold text-lg md:text-xl mb-4 md:mb-6 text-purple-400">Quick Links</h5>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-300">
                <li>
                  <Link to="/about" className="hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">
                    Contact
                  </Link>
                </li>
                <li>
                  <button className="hover:text-white hover:translate-x-2 transition-all duration-300 text-left">
                    Careers
                  </button>
                </li>
                <li>
                  <button className="hover:text-white hover:translate-x-2 transition-all duration-300 text-left">
                    Blog
                  </button>
                </li>

              </ul>
            </div>

            <div>
              <h5 className="font-bold text-lg md:text-xl mb-4 md:mb-6 text-pink-400">Customer Care</h5>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-300">
                <li>
                  <Link to="/help-center" className="hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/returns-refunds" className="hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-info" className="hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">
                    Track Order
                  </Link>
                </li>

              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              &copy; 2026 ShopZone. All rights reserved. Made with ❤️ for amazing shopping experiences!
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-gray-400 text-xs md:text-sm">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <button className="hover:text-white transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>





    </div>
  );
}

export default memo(ProductList);
                    