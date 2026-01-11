import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { WishlistProvider } from "./context/WishListContext";
import { ShippingInfo, ReturnsRefunds, PrivacyPolicy, TermsOfService, HelpCenter } from "./FooterPages/RemainingPages";
import AboutUs from "./FooterPages/AboutUs"
import ContactUs from "./FooterPages/ContactUs"
import ScrollToTop from "./components/ScrollToTop";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";


// ✅ Lazy load heavy components
const ProductList = lazy(() => import("./components/ProductList"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./components/Cart"));
const AdminCreateProduct = lazy(() => import("./components/AdminCreateProduct"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const OrdersPage = lazy(() => import("./pages/Orders"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const WishlistPage = lazy(() => import("./pages/WishListPage"));
const SearchResults = lazy(() => import("./pages/SearchResult"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));


// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <>
      <AuthProvider>
        <WishlistProvider>
          <Header />
          <Suspense fallback={<PageLoader />}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
             <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
              <Route path="/returns-refunds" element={<ReturnsRefunds />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/help-center" element={<HelpCenter />} />
              {/* Admin routes */}
              <Route path="/admin/create-product" element={<AdminRoute><AdminCreateProduct /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />

              {/* User orders */}
              <Route path="/orders" element={<UserRoute><OrdersPage /></UserRoute>} />
            </Routes>
          </Suspense>
        </WishlistProvider>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

// AdminRoute
const AdminRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user || user.role !== "admin") return <Navigate to="/login" />;
  return children;
};

// UserRoute
const UserRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user || user.role === "admin") return <Navigate to="/login" />;
  return children;
};

export default App;
