import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import { WishlistProvider } from "./context/WishListContext";
import { AuthProvider } from "./context/AuthContext"; 
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <SearchProvider>
          <WishlistProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{ duration: 2000 }}
            />
          </WishlistProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);




