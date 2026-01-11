// import React, { useContext, useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useApi } from "../api";
// import { AuthContext } from "../context/AuthContext";
// import { useWishlist } from "../context/WishListContext";
// import { ShoppingCart, Zap, Heart, Star } from "lucide-react";
// import toast from "react-hot-toast";


// function ProductCard({ product,onQuickView }) {
//   const { user } = useContext(AuthContext);
//   const { addToCart, getCart } = useApi();
//   const { toggleWishlist, isInWishlist } = useWishlist();
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);
//   const [isLiked, setIsLiked] = useState(isInWishlist(product._id));
//   const [addedToCart, setAddedToCart] = useState(false);
  

//   const finalPrice =
//     product.isFlashDeal && product.flashDealPrice
//       ? product.flashDealPrice
//       : product.discount > 0
//       ? product.price - (product.price * product.discount) / 100
//       : product.price;

//   useEffect(() => {
//     const checkCart = async () => {
//       if (!user) return;
//       try {
//         const res = await getCart(user.userId, user.jwttok);
//         if (res?.success) {
//           const exists = res.cart.products.some(
//             (item) => item.productId._id === product._id
//           );
//           setAddedToCart(exists);
//         }
//       } catch {}
//     };
//     checkCart();
//   }, [user, product._id, getCart]);

//   const handleAddToCart = async () => {
//     if (!user) return toast.error("Please login to add products to cart.");
//     setIsLoading(true);
//     try {
//       const res = await addToCart(user.userId, product._id, 1, user.jwttok);
//       if (res.success) {
//         toast.success(`${product.name} added to cart 🛒`);
//         setAddedToCart(true);
//       } else {
//         toast.error(res.message || "Failed to add to cart");
//       }
//     } catch (err) {
//       console.error("❌ Error adding to cart:", err);
//       toast.error("Something went wrong while adding to cart");
//     }
//     setIsLoading(false);
//   };

//   const handleWishlistClick = () => {
//     toggleWishlist(product);
//     if (isLiked) toast.error("Removed from Wishlist 💔");
//     else toast.success("Added to Wishlist ❤️");
//     setIsLiked(!isLiked);
//   };

//   const handleBuyNow = async () => {
//     if (!user) return toast.error("Please login to continue");
//     setIsLoading(true);
//     try {
//       const res = await addToCart(user.userId, product._id, 1, user.jwttok);
//       if (res.success) navigate("/cart");
//       else toast.error("Failed to add to cart");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error processing buy now");
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 relative flex flex-col h-full">
//       {/* Wishlist Button */}
//       <button
//         onClick={handleWishlistClick}
//         className="absolute top-4 right-4 z-10 p-2 bg-red-200 rounded-full shadow-lg transition-all duration-300"
//       >
//         <Heart
//           className={`w-5 h-5 transition-colors ${
//             isLiked
//               ? "text-red-600 fill-current"
//               : "text-gray-600 hover:text-red-600"
//           }`}
//         />
//       </button>

//    {onQuickView && (  // ✅ Only show if onQuickView is passed
//     <button
//       onClick={(e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         onQuickView();
//       }}
//       className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg z-10"
//     >
//       👁️
//     </button>
//   )}  

//       {/* Product Image */}
//       <Link
//         to={`/product/${product._id}`}
//         className="block relative overflow-hidden flex-shrink-0"
//       >
//         <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100">
//           <img
//             src={product.image?.[0]}
//             alt={product.name}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//           />
//         </div>
//       </Link>

//       {/* Product Info */}
//       <div className="flex flex-col justify-between flex-grow p-6">
//         <div>
//           <div className="flex items-center justify-between mb-3">
//             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
//               {product.category}
//             </span>
//             <div className="flex items-center gap-1">
//               <Star className="w-4 h-4 text-yellow-400 fill-current" />
//               <span className="text-sm text-gray-600">4.8</span>
//             </div>
//           </div>

//           <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight min-h-[48px]">
//             <Link to={`/product/${product._id}`} className="hover:text-blue-600">
//               {product.name}
//             </Link>
//           </h3>

//           <div className="flex items-baseline gap-2 mb-4">
//             <span className="text-2xl font-bold text-gray-900">
//               ₹{finalPrice.toFixed(2)}
//             </span>
//             {product.discount > 0 && (
//               <>
//                 <span className="text-sm text-gray-500 line-through">
//                   ₹{product.price.toFixed(2)}
//                 </span>
//                 <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
//                   {product.discount}% OFF
//                 </span>
//               </>
//             )}
//           </div>

//           <div className="flex items-center gap-2 mb-4">
//             {product.stock > 0 ? (
//               <span className="text-sm text-green-600 font-medium">
//                 {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
//               </span>
//             ) : (
//               <span className="text-sm text-red-600 font-medium">
//                 Out of Stock
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons at bottom */}
//         <div className="space-y-3 mt-auto">
//           {product.stock > 0 ? (
//             <>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={isLoading}
//                 className="w-full bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all disabled:opacity-50"
//               >
//                 <Zap className="w-5 h-5 inline-block mr-2" />
//                 {isLoading ? "Processing..." : "Buy Now"}
//               </button>

//               <button
//                 onClick={addedToCart ? () => navigate("/cart") : handleAddToCart}
//                 disabled={isLoading}
//                 className={`w-full px-6 py-3 rounded-2xl font-semibold transition-all ${
//                   addedToCart
//                     ? "bg-blue-600 text-white hover:bg-blue-700"
//                     : "bg-white border-2 border-gray-300 text-gray-800 hover:border-blue-500 hover:text-blue-600"
//                 }`}
//               >
//                 <ShoppingCart className="w-5 h-5 inline-block mr-2" />
//                 {isLoading
//                   ? addedToCart
//                     ? "Going..."
//                     : "Adding..."
//                   : addedToCart
//                   ? "Go to Cart"
//                   : "Add to Cart"}
//               </button>
//             </>
//           ) : (
//             <button
//               disabled
//               className="w-full bg-gray-200 text-gray-500 px-6 py-4 rounded-2xl font-semibold cursor-not-allowed"
//             >
//               Out of Stock
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;


import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishListContext";
import { ShoppingCart, Zap, Heart, Star } from "lucide-react";
import toast from "react-hot-toast";


function ProductCard({ product, onQuickView }) {
  const { user } = useContext(AuthContext);
  const { addToCart, getCart } = useApi();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(isInWishlist(product._id));
  const [addedToCart, setAddedToCart] = useState(false);
  

  const finalPrice =
    product.isFlashDeal && product.flashDealPrice
      ? product.flashDealPrice
      : product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  useEffect(() => {
    const checkCart = async () => {
      if (!user) return;
      try {
        const res = await getCart(user.userId, user.jwttok);
        if (res?.success) {
          const exists = res.cart.products.some(
            (item) => item.productId._id === product._id
          );
          setAddedToCart(exists);
        }
      } catch {}
    };
    checkCart();
  }, [user, product._id, getCart]);

  const handleAddToCart = async () => {
    if (!user) return toast.error("Please login to add products to cart.");
    setIsLoading(true);
    try {
      const res = await addToCart(user.userId, product._id, 1, user.jwttok);
      if (res.success) {
        toast.success(`${product.name} added to cart 🛒`);
        setAddedToCart(true);
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      toast.error("Something went wrong while adding to cart");
    }
    setIsLoading(false);
  };

  const handleWishlistClick = () => {
    toggleWishlist(product);
    if (isLiked) toast.error("Removed from Wishlist 💔");
    else toast.success("Added to Wishlist ❤️");
    setIsLiked(!isLiked);
  };

  const handleBuyNow = async () => {
    if (!user) return toast.error("Please login to continue");
    setIsLoading(true);
    try {
      const res = await addToCart(user.userId, product._id, 1, user.jwttok);
      if (res.success) navigate("/cart");
      else toast.error("Failed to add to cart");
    } catch (err) {
      console.error(err);
      toast.error("Error processing buy now");
    }
    setIsLoading(false);
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 relative flex flex-col h-full">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10 p-1.5 sm:p-2 bg-red-200 rounded-full shadow-lg transition-all duration-300"
      >
        <Heart
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
            isLiked
              ? "text-red-600 fill-current"
              : "text-gray-600 hover:text-red-600"
          }`}
        />
      </button>

      {onQuickView && (  // ✅ Only show if onQuickView is passed
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView();
          }}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white transition-all shadow-lg z-10 text-sm sm:text-base"
        >
          👁️
        </button>
      )}  

      {/* Product Image */}
      <Link
        to={`/product/${product._id}`}
        className="block relative overflow-hidden flex-shrink-0"
      >
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={product.image?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-grow p-3 sm:p-4 md:p-6">
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-medium rounded-full">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              <span className="text-xs sm:text-sm text-gray-600">4.8</span>
            </div>
          </div>

          <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-1.5 sm:mb-2 leading-tight min-h-[40px] sm:min-h-[48px]">
            <Link to={`/product/${product._id}`} className="hover:text-blue-600 line-clamp-2">
              {product.name}
            </Link>
          </h3>

          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4 flex-wrap">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              ₹{finalPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-[10px] sm:text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
            {product.stock > 0 ? (
              <span className="text-xs sm:text-sm text-green-600 font-medium">
                {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons at bottom */}
        <div className="space-y-2 sm:space-y-3 mt-auto">
          {product.stock > 0 ? (
            <>
              <button
                onClick={handleBuyNow}
                disabled={isLoading}
                className="w-full bg-green-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-green-600 transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 inline-block mr-1 sm:mr-2" />
                {isLoading ? "Processing..." : "Buy Now"}
              </button>

              <button
                onClick={addedToCart ? () => navigate("/cart") : handleAddToCart}
                disabled={isLoading}
                className={`w-full px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all ${
                  addedToCart
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white border-2 border-gray-300 text-gray-800 hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 inline-block mr-1 sm:mr-2" />
                {isLoading
                  ? addedToCart
                    ? "Going..."
                    : "Adding..."
                  : addedToCart
                  ? "Go to Cart"
                  : "Add to Cart"}
              </button>
            </>
          ) : (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;