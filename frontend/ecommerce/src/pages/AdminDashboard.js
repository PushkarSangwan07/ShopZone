import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "../api";
import { useNavigate } from "react-router-dom";

import { 
  ShoppingBag, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Search,
  RefreshCw,
  Eye,
  Filter,
  BarChart3,
  Package
} from "lucide-react";

const AdminDashboard = () => {
  const { getAllProducts, getAllOrders, getAllUsers } = useApi();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    ordersByStatus: {},
    recentOrders: [],
    recentProducts: [],
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        getAllProducts(token),
        getAllOrders(token),
        getAllUsers(token)
      ]);

      if (productsRes.success && ordersRes.success && usersRes.success) {
        const ordersByStatus = ordersRes.orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        const revenue = ordersRes.orders.reduce((total, order) => 
          total + (order.totalAmount || 0), 0
        );

        setStats({
          totalProducts: productsRes.products.length,
          totalUsers: usersRes.users.length,
          totalOrders: ordersRes.orders.length,
          ordersByStatus,
          recentOrders: ordersRes.orders.slice(-8).reverse(),
          recentProducts: productsRes.products.slice(-6).reverse(),
          revenue
        });
      } else {
        alert("Failed to fetch stats");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAllProducts, getAllOrders, getAllUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
  };

  const filteredOrders = stats.recentOrders.filter(order => {
    const matchesSearch = order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500"
    };
    return colors[status?.toLowerCase()] || "bg-gray-500";
  };

  // ✅ Navigation handlers for quick actions
  const handleAddProduct = () => navigate("/admin/create-product");
  const handleViewOrders = () => navigate("/admin/orders");
  const handleManageUsers = () => navigate("/admin/users");
  const handleViewProduct = (productId) => navigate(`/product/${productId}`);
  
  // ✅ Handle analytics - scroll to stats
  const handleAnalytics = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your store performance</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order Status Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Order Status</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                  <span className="text-sm font-medium capitalize text-gray-700">{status}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - NOW FUNCTIONAL */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
              onClick={handleAddProduct}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center group"
            >
              <Package className="h-6 w-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-blue-700">Add Product</span>
            </button>
            
            <button 
              onClick={handleViewOrders}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center group"
            >
              <Eye className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-green-700">View Orders</span>
            </button>
            
            <button 
              onClick={handleManageUsers}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center group"
            >
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-purple-700">Manage Users</span>
            </button>
            
            <button 
              onClick={handleAnalytics}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center group"
            >
              <BarChart3 className="h-6 w-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-orange-700">Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                />
              </div>
              <div className="relative">
                <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  {Object.keys(stats.ordersByStatus).map(status => (
                    <option key={status} value={status} className="capitalize">{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Order ID</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-gray-600">#{order._id.slice(-8)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {order.userId?.name?.[0] || 'U'}
                      </div>
                      <span className="font-medium text-gray-900">{order.userId?.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">₹{order.totalAmount}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={handleViewOrders}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Products - NOW CLICKABLE */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Products</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stats.recentProducts.map((product) => (
              <div 
                key={product._id} 
                onClick={() => handleViewProduct(product._id)}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1 truncate group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>
                <p className="text-blue-600 font-bold text-sm">₹{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

