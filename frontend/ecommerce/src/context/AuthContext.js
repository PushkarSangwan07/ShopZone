import React, { createContext, useState, useContext } from "react";
import { useApi } from "../api";
import { useNavigate } from "react-router-dom"; // ✅ added

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { login: apiLogin, signup: apiSignup } = useApi();
  const navigate = useNavigate(); 
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState(null);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.success) {
      const u = {
        name: res.name,
        email: res.email,
        userId: res.userId,
        jwttok: res.token,
        role: res.role || "User",
      };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    }
    return res;
  };

  const signup = async (name, email, password) =>
    await apiSignup(name, email, password);

  const logout = () => {
    // ✅ Clear everything related to User A
    setUser(null);
    localStorage.removeItem("user");
    setCart(null);
    setWishlist(null);

    // ✅ Navigate to login and REPLACE history so back arrow won’t return
    navigate("/login", { replace: true });

    // ✅ Optional: force scroll top (better UX)
    window.scrollTo(0, 0);

    // ✅ Also push a new empty state so browser back is disabled immediately
    window.history.pushState(null, "", window.location.href);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, cart, setCart, wishlist, setWishlist }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

