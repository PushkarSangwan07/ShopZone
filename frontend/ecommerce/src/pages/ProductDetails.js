import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishListContext";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

// Reusable Feature Component (Using Emoji Icons)
const ProductFeature = ({ icon, label }) => (
  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
    <span className="text-xl">{icon}</span>
    <span className="text-gray-700 text-sm">{label}</span>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { getProductById, addToCart ,getCart} = useApi();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  // Random review data
  const reviewTemplates = [
    { name: "Rajesh Kumar", rating: 5, text: "Excellent product! Totally worth the price. Highly recommended!" },
    { name: "Priya Sharma", rating: 4, text: "Good quality, fast delivery. Very satisfied with my purchase." },
    { name: "Amit Patel", rating: 5, text: "Amazing deal! Product exceeded my expectations." },
    { name: "Sneha Verma", rating: 4, text: "Great value for money. Would definitely buy again." },
    { name: "Vikram Singh", rating: 5, text: "Best purchase ever! Quality is top-notch." },
    { name: "Anita Desai", rating: 4, text: "Nice product, timely delivery. Happy with the service." },
    { name: "Rohan Mehta", rating: 5, text: "Superb quality! Exactly as described. Very happy!" },
    { name: "Kavita Rao", rating: 4, text: "Good product at a great price. Recommended!" },
    { name: "Sanjay Gupta", rating: 5, text: "Outstanding! This is exactly what I was looking for." },
    { name: "Deepika Joshi", rating: 4, text: "Very good quality. Fast shipping. Will order again!" }
  ];

  // Function to get random reviews for a product
  const getRandomReviews = (productId, count = 2) => {
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...reviewTemplates].sort(() => (seed % 2 === 0 ? 1 : -1));
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const checkCart = async () => {
      if (!user || !product) return;
      try {
        const res = await getCart(user.userId, user.jwttok);
        if (res?.success) {
          const exists = res.cart.products.some(
            (item) => item.productId._id === product._id
          );
          setAddedToCart(exists);
        }
      } catch { }
    };

    checkCart();
  }, [user, product]);


  useEffect(() => {
    setProduct(null);
    setLoading(true);
    setStatusMessage(null);

    const fetchProduct = async () => {
      try {
        if (!id) return;
        const res = await getProductById(id);

        if (res?.success && res.product) {
          setProduct(res.product);
          setIsLiked(isInWishlist(res.product._id));
        } else {
          setStatusMessage("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setStatusMessage("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // ✅ only depend on id




  const handleVariantChange = (variantName, value) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: value }));
  };

  // Unified price calculation (variants + flash deal)
  const calculateFinalPrice = () => {
    if (!product) return 0;
    const basePrice =
      product.isFlashDeal && product.flashDealPrice
        ? product.flashDealPrice
        : product.price;

    let total = basePrice;

    product.variants?.forEach((variant) => {
      const selectedOption = variant.options.find(
        (opt) => opt.value === selectedVariants[variant.name]
      );
      if (selectedOption?.price) total += selectedOption.price;
    });

    return total;
  };




  const handleAddToCart = async () => {
    if (!user) return toast.error("Please login to add products to cart.");

    //  Check if all variants are selected
    if (product.variants && product.variants.length > 0) {
      const missingVariants = product.variants.filter(
        (variant) => !selectedVariants[variant.name]
      );

      if (missingVariants.length > 0) {
        toast.error(`⚠️ Please select: ${missingVariants.map(v => v.name).join(", ")}`);
        return;
      }
    }
    setIsLoading(true);

    try {

      const finalPrice = calculateFinalPrice();
      const res = await addToCart(
        user.userId,
        product._id,
        1,
        user.jwttok,
        selectedVariants,
        finalPrice,
      );

      if (res.success) {
        toast.success("Added to cart 🛒");
        setAddedToCart(true);
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding to cart");
    }
    setIsLoading(false);

  };

  const handleBuyNow = async () => {
    if (!user) return toast.error("Please login to continue");

    // ✅ Check if all variants are selected
    if (product.variants && product.variants.length > 0) {
      const missingVariants = product.variants.filter(
        (variant) => !selectedVariants[variant.name]
      );

      if (missingVariants.length > 0) {
        toast.error(`⚠️ Please select: ${missingVariants.map(v => v.name).join(", ")}`);
        return;
      }
    }

    setIsLoading(true)

    try {
      const finalPrice = calculateFinalPrice();
      const res = await addToCart(
        user.userId,
        product._id,
        1,
        user.jwttok,
        selectedVariants,
        finalPrice
      );

      if (res.success) {
        toast.success("Redirecting to cart...");
        navigate("/cart");
      } else toast.error("Failed to add to cart");
    } catch (err) {
      console.error(err);
      toast.error("Error processing buy now");
    }
    setIsLoading(false)
  };






  const handleWishlistClick = () => {
    toggleWishlist(product);
    toast[isLiked ? "error" : "success"](
      isLiked ? "Removed from Wishlist 💔" : "Added to Wishlist ❤️"
    );
    setIsLiked(!isLiked);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-xl font-semibold text-red-500 mb-2">
            Product Not Found
          </p>
          <p className="text-gray-600">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );

  const images =
    product.image && product.image.length > 0
      ? product.image
      : ["https://placehold.co/400x400"];

  const displayPrice = calculateFinalPrice();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="container mx-auto max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* Images Section */}
          <div className="md:w-1/2 p-6 md:p-12 flex flex-col items-center relative">
            <div className="relative w-full max-w-md">
              {/* Main Image */}
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-md"
              />

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
              >
                <Heart
                  className={`w-6 h-6 ${isLiked
                    ? "text-red-500 fill-current"
                    : "text-gray-400 hover:text-red-500"
                    }`}
                />
              </button>

              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/*  Thumbnail Image Row */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 flex-wrap justify-center">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${selectedImageIndex === index
                      ? "border-blue-600 scale-105"
                      : "border-gray-300 hover:scale-105"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>


          {/* Details */}
          <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Price with automatic discount */}
            <p className="text-black text-2xl font-bold mb-4">
              ₹{displayPrice.toLocaleString()}
              {displayPrice < product.price && (
                <>
                  <span className="text-gray-500 line-through text-lg ml-2">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-red-500 font-semibold ml-2">
                    {Math.round(
                      ((product.price - displayPrice) / product.price) * 100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants?.map((variant) => (
              <div key={variant.name} className="mb-4">
                <p className="font-semibold mb-2">{variant.name}:</p>
                <div className="flex flex-wrap gap-3">
                  {variant.options.map((opt) => {
                    const isSelected =
                      selectedVariants[variant.name] === opt.value;
                    const variantPrice =
                      (product.isFlashDeal && product.flashDealPrice
                        ? product.flashDealPrice
                        : product.price) + (opt.price || 0);

                    return (
                      <button
                        key={opt.value}
                        onClick={() =>
                          handleVariantChange(variant.name, opt.value)
                        }
                        className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border w-32 text-center transition-all ${isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        <span className="font-semibold text-sm">{opt.value}</span>
                        <span className="text-sm">
                          ₹{variantPrice.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Features Section (Below Description & Variants) */}
            <div className="flex flex-wrap gap-3 my-4 mt-6">
              <ProductFeature icon="🚚" label="Free Delivery" />
              <ProductFeature icon="💵" label="Pay on Delivery" />
              <ProductFeature icon="🛡️" label="Warranty" />
              <ProductFeature icon="🏆" label="Top Brand" />
              <ProductFeature icon="↩️" label="Easy Returns" />
              <ProductFeature icon="📞" label="24/7 Support" />
            </div>

            {/* Add to Cart / Buy Now */}
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {/* BUY NOW — always same */}
                <button
                  onClick={handleBuyNow}
                  disabled={isLoading}
                  className="w-full sm:w-1/2 py-4 rounded-xl text-white font-semibold bg-green-500 hover:bg-green-600 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Buy Now"}
                </button>

                {/* ADD TO CART — stateful */}
                <button
                  onClick={addedToCart ? () => navigate("/cart") : handleAddToCart}
                  disabled={isLoading}
                  className={`w-full sm:w-1/2 py-4 rounded-xl font-semibold transition-all ${addedToCart
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white border-2 border-gray-300 text-gray-800 hover:border-blue-500 hover:text-blue-600"
                    }`}
                >
                  {isLoading
                    ? addedToCart
                      ? "Going..."
                      : "Adding..."
                    : addedToCart
                      ? "Go to Cart"
                      : "Add to Cart"}
                </button>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                <p className="font-semibold">This product is currently out of stock.</p>
              </div>
            )}


            {/* Random Reviews Section */}
            <div className="mt-4 space-y-2 border-t pt-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Recent Reviews:</p>
              {getRandomReviews(product._id, 2).map((review, idx) => (
                <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-800">{review.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{review.text}</p>
                </div>
              ))}
            </div>
            {statusMessage && (
              <div className="mt-4 p-4 text-center bg-gray-200 text-gray-800 rounded-lg">
                <p>{statusMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

