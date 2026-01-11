import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.userId || null;

  // Render immediately: don't block on loading
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      // Synchronously try to read localStorage for the current user
      if (!user) return [];
      const saved = localStorage.getItem(`wishlist_${user.userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Wishlist read error:", e);
      return [];
    }
  });

  // Keep a local flag to avoid saving before initial load (not required but safe)
  const [initialized, setInitialized] = useState(!!wishlistItems.length);

  // When user changes, reload list (non-blocking)
  useEffect(() => {
    try {
      if (!userId) {
        setWishlistItems([]);
        setInitialized(true);
        return;
      }
      const saved = localStorage.getItem(`wishlist_${userId}`);
      const parsed = saved ? JSON.parse(saved) : [];
      setWishlistItems(parsed);
    } catch (err) {
      console.warn("Error loading wishlist:", err);
      setWishlistItems([]);
    } finally {
      setInitialized(true);
    }
  }, [userId]);

  // Save changes to localStorage (only after initial load)
  useEffect(() => {
    if (!userId || !initialized) return;
    try {
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlistItems));
    } catch (err) {
      console.warn("Error saving wishlist:", err);
    }
  }, [wishlistItems, userId, initialized]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.find((item) => item._id === product._id)) return prev;
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearWishlist = () => setWishlistItems([]);

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) return prev.filter((item) => item._id !== product._id);
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  const isInWishlist = (productId) => wishlistItems.some((item) => item._id === productId);
  const getWishlistCount = () => wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        initialized,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
