import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useApi } from "../api";
import { Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ✅ Memoized CartItem Component (re-renders only if props change)
const CartItem = React.memo(({ item, onQuantityChange, onRemove, navigate }) => {
  const { productId, quantity, price, variants } = item;
  const img = productId?.image?.[0] || "https://placehold.co/100x100/CCCCCC/333333?text=No+Image";

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <img
        src={img}
        alt={productId?.name || 'Product'}
        loading="lazy"
        className="w-24 h-24 object-cover rounded-xl mb-4 sm:mb-0 sm:mr-6 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() => navigate(`/product/${productId._id}`)}
      />

      <div className="flex-grow text-center sm:text-left">
        <p className="font-bold text-lg text-gray-900 mb-1">{productId?.name}</p>
        <p className="text-purple-600 font-semibold text-xl">₹{price?.toFixed(2) || 0}</p>

        {variants && Object.keys(variants).length > 0 && (
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            {Object.entries(variants).map(([key, value]) => (
              <p key={key} className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">{key}:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{value}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3 mt-4 sm:mt-0">
        <div className="flex items-center border-2 border-gray-200 rounded-xl p-1 bg-gray-50">
          <button
            onClick={() => onQuantityChange(productId._id, quantity - 1, variants)}
            className="px-3 py-1 text-gray-600 hover:text-purple-600 font-bold transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange(productId._id, Number(e.target.value), variants)}
            className="w-12 text-center p-1 bg-transparent font-semibold text-gray-900 outline-none"
          />
          <button
            onClick={() => onQuantityChange(productId._id, quantity + 1, variants)}
            className="px-3 py-1 text-gray-600 hover:text-purple-600 font-bold transition-colors"
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(productId._id, variants)}
          className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all transform hover:scale-110"
          title="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const { getCart, updateCartItem, removeCartItem } = useApi();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
 

  // ✅ Memoized Toast Function
  const showToast = useCallback((msg, type = "success") => {
    if (type === "error") toast.error(msg);
    else toast.success(msg);
  }, []);

  // ✅ Optimized: Fetch cart only once with better error handling
  useEffect(() => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchCart = async () => {
      try {
        const res = await getCart(user.userId, user.jwttok);
        if (mounted) {
          if (res.success) {
            setCart(res.cart);
          } else {
            setCart({ products: [] });
          }
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
        if (mounted) {
          setCart({ products: [] });
          showToast("Failed to fetch cart", "error");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCart();
    return () => { mounted = false; };
  }, [user?.userId]); 

  // ✅ Debounced Quantity Change Handler

const handleQuantityChange = useCallback((productId, quantity, variants) => {
  if (!user) return;
  if (quantity < 1) return;

  setCart((prev) => {
    if (!prev) return prev;
    const updatedProducts = prev.products.map((item) =>
      item.productId._id === productId &&
      JSON.stringify(item.variants) === JSON.stringify(variants)
        ? { ...item, quantity }
        : item
    );
    return { ...prev, products: updatedProducts };
  });

  clearTimeout(window._quantityTimeout);
  window._quantityTimeout = setTimeout(async () => {
    try {
      const res = await updateCartItem(
        user.userId,
        productId,
        quantity,
        user.jwttok,
        variants
      );
      if (res.success) showToast("Quantity updated");
      else showToast("Failed to update", "error");
    } catch {
      showToast("Error updating quantity", "error");
    }
  }, 400);
}, [user?.userId, user?.jwttok, updateCartItem, showToast]);


const handleRemove = useCallback(async (productId, variants) => {
  if (!user) return;

  setCart((prev) => ({
    ...prev,
    products: prev.products.filter(
      (p) =>
        !(p.productId._id === productId &&
          JSON.stringify(p.variants) === JSON.stringify(variants))
    ),
  }));

  try {
    const res = await removeCartItem(
      user.userId,
      productId,
      variants,
      user.jwttok
    );
    if (res.success) showToast("Item removed");
    else showToast("Failed to remove", "error");
  } catch {
    showToast("Error removing item", "error");
  }
}, [user?.userId, user?.jwttok, removeCartItem, showToast]);

  // ✅ NEW: Proceed to Checkout (redirects to new checkout page)
  const handleProceedToCheckout = () => {
    if (!cart?.products?.length) {
      showToast("Your cart is empty", "error");
      return;
    }
    navigate('/checkout');
  };

  // ✅ Compute totals (memoized)
  const { subtotal, shipping, tax, total } = useMemo(() => {
    if (!cart?.products) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    
    const subtotal = cart.products.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    const shipping = subtotal > 499 ? 0 : 50;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  }, [cart?.products]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
          <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-600 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-semibold animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  // ✅ Login Prompt
  if(!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full">
          <ShoppingBag className="w-20 h-20 text-purple-600 mx-auto mb-4" />
          <p className="text-2xl font-bold mb-2 text-gray-900">Please Log In</p>
          <p className="text-gray-600 mb-6">Login to view items in your cart.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-2xl text-lg font-bold hover:shadow-xl transition-all transform hover:scale-105"
          >
            LOGIN
          </button>
        </div>
      </div>
    );
  }

  // ✅ Empty Cart
  if (!cart?.products?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <ShoppingBag className="w-32 h-32 text-gray-300 mb-6" />
        <p className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</p>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all transform hover:scale-105"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-8">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-purple-600" />
            Your Cart
          </h2>
          <p className="text-gray-600">{cart.products.length} {cart.products.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.products.map((item) => (
              <CartItem
                key={`${item.productId._id}-${JSON.stringify(item.variants)}`}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                navigate={navigate}
              />
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-gray-900">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-black text-purple-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button (NEW) */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-3 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

            

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure checkout with 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;