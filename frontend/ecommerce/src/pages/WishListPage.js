import React, { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishListContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

function WishlistPage() {
  const { wishlistItems, clearWishlist, removeFromWishlist, getWishlistCount, setWishlistItems } = useWishlist();
  const { user } = useAuth();

  const [prevUserId, setPrevUserId] = useState(user?.userId || null);

  // Detect if user switched
  const userChanged = user?.userId && user?.userId !== prevUserId;

  useEffect(() => {
    if (user?.userId) setPrevUserId(user.userId);
  }, [user?.userId]);

  const reloadWishlist = () => {
    const saved = localStorage.getItem(`wishlist_${user.userId}`);
    setWishlistItems(saved ? JSON.parse(saved) : []);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border border-gray-100">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Please log in to view your wishlist items</p>
          </div>
          
          
           <a href="/login"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" >
            Log In
          </a>
          
          <p className="mt-4 text-sm text-gray-500">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Sign up</a>
          </p>
        </div>
      </div>
    );
  }

  if (userChanged) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-xl mb-4">
          You switched accounts. Refresh or reload to see your wishlist.
        </p>
        <button
          onClick={reloadWishlist}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Reload Wishlist
        </button>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-8xl mb-6 animate-pulse">💜</div>
            <h1 className="text-5xl font-black text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Wishlist is Empty
              </span>
            </h1>
            <p className="text-gray-600 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
              Start adding products by clicking the heart icon.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🛍️ Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-800 mb-4 flex items-center">
              💜 <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-3">My Wishlist</span>
            </h1>
            <p className="text-gray-600 text-xl">
              {getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={clearWishlist}
              className="group bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              Clear All
            </button>
            <button
              onClick={() => window.history.back()}
              className="group border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-purple-50 transition-all duration-300 flex items-center space-x-2"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Wishlist Items - FIXED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product, index) => (
            <div 
              key={product._id} 
              className="relative group"
              style={{ 
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Date Badge */}
              <div className="absolute top-2 left-2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                Added {new Date(product.addedAt).toLocaleDateString()}
              </div>
              
              {/* Remove Button - Positioned to avoid heart icon */}
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-14 bg-red-500 hover:bg-red-600 text-white w-9 h-9 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-20 text-xl font-bold"
                title="Remove from wishlist"
              >
                ×
              </button>

              {/* Product Card */}
              <div className="h-full">
                <ProductCard product={product} showWishlistIcon={true} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default WishlistPage;