import { useMemo } from 'react';

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:4000";

//  Helper to get token (cached)
// const getToken = () => localStorage.getItem("token");
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.jwttok;
};


//  Reusable fetch wrapper with error handling
const apiFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    return await res.json();
  } catch (err) {
    console.error(`API Error at ${url}:`, err);
    throw err;
  }
};

//  Reusable authenticated fetch
// const authFetch = async (url, options = {}) => {
//   const token = getToken();
//   return apiFetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//       ...(token && { Authorization: `Bearer ${token}` })
//     }
//   });
// };

export const useApi = () => {
  //  Memoize all functions to prevent recreation on every render
  return useMemo(() => ({
    // ---------- Auth ----------
    login: (email, password) => 
      apiFetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),

    signup: (name, email, password) => 
      apiFetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }),

    // ---------- Products ----------
    getProducts: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return apiFetch(`${API_BASE}/products?${params.toString()}`);
    },

    getProductById: async (id) => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error("getProductById error:", err);
        return { success: false, message: "Failed to fetch product" };
      }
    },

    createProduct: (product) => {
      const token = getToken();
      if (!token) throw new Error("No token found");
      
      return apiFetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
    },

    updateProduct: (id, productData, token) => 
      apiFetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || getToken()}`
        },
        body: JSON.stringify(productData),
      }),

    deleteProduct: (id, token) => 
      apiFetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || getToken()}` },
      }),

    getAllProducts: () => apiFetch(`${API_BASE}/products`),

    // ---------- Cart ----------
    getCart: (userId, token) => 
      apiFetch(`${API_BASE}/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token || getToken()}` },
      }),

    addToCart: (userId, productId, quantity, token, variants = {}, price = null) => 
      apiFetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || getToken()}` 
        },
        body: JSON.stringify({ userId, productId, quantity: Number(quantity), variants, price }),
      }),

    updateCartItem: (userId, productId, quantity, token) => 
      apiFetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || getToken()}` 
        },
        body: JSON.stringify({ quantity }),
      }),

    removeCartItem: (userId, productId, variants, token) => 
      apiFetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || getToken()}`,
        },
        body: JSON.stringify({ variants }),
      }),

    // ---------- Orders ----------
    placeOrder: (orderData) => {
      const token = getToken();
      if (!token) throw new Error("No token found");
      
      return apiFetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
    },

    getOrders: () => {
      const token = getToken();
      if (!token) throw new Error("No token found");
      
      return apiFetch(`${API_BASE}/orders/user/me`, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    getOrderById: (orderId) => {
  const token = getToken();
  if (!token) throw new Error("No token found");
  
  return apiFetch(`${API_BASE}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
},

    getAllOrders: (token) => 
      apiFetch(`${API_BASE}/orders/all`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || getToken()}`
        }
      }),

    cancelOrder: (orderId) => {
      const token = getToken();
      if (!token) throw new Error("No token found");
      
      return apiFetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },

    updateOrderStatus: (id, status, token) => 
      apiFetch(`${API_BASE}/orders/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || getToken()}`
        },
        body: JSON.stringify({ status })
      }),

    deleteOrder: (id, token) => 
      apiFetch(`${API_BASE}/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || getToken()}` }
      }),

    // ---------- Payment ----------
    initiatePayment: (orderId, method, token) => 
      apiFetch(`${API_BASE}/payment/initiate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || getToken()}`
        },
        body: JSON.stringify({ orderId, method })
      }),

    // ---------- Users ----------
    getAllUsers: (token) => 
      apiFetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token || getToken()}` },
      }),

    // ---------- Flash Deals ----------
    saveFlashDeal: async (dealData, token) => {
      try {
        return await apiFetch("/flash-deals/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || getToken()}`,
          },
          body: JSON.stringify(dealData),
        });
      } catch (err) {
        console.error(err);
        return { success: false, message: "Failed to save flash deal" };
      }
    },

    fetchFlashDeals: async () => {
      try {
        return await apiFetch(`${API_BASE}/products/flash-deals`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Error fetching flash deals:", err);
        return { success: false, flashDeals: [] };
      }
    },

    // ---------- Offers ----------
    fetchOffers: async () => {
      try {
        const data = await apiFetch("/offers");
        return data.success ? data.offers : [];
      } catch (err) {
        console.error("Error fetching offers:", err);
        return [];
      }
    },

    // ---------- Categories ----------
    getCategories: async () => {
      try {
        return await apiFetch(`${API_BASE}/categories`);
      } catch (err) {
        console.error("Error fetching categories:", err);
        return { success: false, categories: [] };
      }
    },
  }), []); //  Empty deps - functions never recreate
};