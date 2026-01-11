import React, { useEffect, useState } from "react";
import { Search, Filter, Download, RefreshCw, Package, Truck, CheckCircle, XCircle, Clock, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useApi } from "../api";

const AdminOrders = () => {
  const { getAllOrders, updateOrderStatus, deleteOrder } = useApi();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, paymentFilter, dateRange, sortBy]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await getAllOrders(token);

      if (res.success) {
        setOrders(res.orders);
      } else {
        alert(res.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "All") {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) <= new Date(dateRange.end + "T23:59:59")
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-high":
          return b.totalAmount - a.totalAmount;
        case "amount-low":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await updateOrderStatus(id, status, token);
      if (res.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
          )
        );
        alert("Status updated successfully");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await deleteOrder(id, token);
      if (res.success) {
        setOrders(prev => prev.filter(o => o._id !== id));
        alert("Order deleted successfully");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Total", "Status", "Payment Status", "Date", "Tracking"];
    const rows = filteredOrders.map(order => [
      order._id,
      order.userId?.name || "N/A",
      order.totalAmount,
      order.status,
      order.paymentStatus,
      new Date(order.createdAt).toLocaleDateString(),
      order.trackingNumber || "N/A"
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      Paid: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
      Refunded: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const StatusIcon = ({ status }) => {
    const icons = {
      Pending: <Clock className="w-4 h-4" />,
      Processing: <Package className="w-4 h-4" />,
      Shipped: <Truck className="w-4 h-4" />,
      Delivered: <CheckCircle className="w-4 h-4" />,
      Cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === "Processing").length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.status === "Shipped").length}
              </p>
            </div>
            <Truck className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === "Delivered").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Order ID, customer, tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> orders
        </p>
      </div>

      {/* Orders Table/Cards */}
      {!filteredOrders.length ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order._id;

            return (
              <div key={order._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Order Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                          <StatusIcon status={order.status} />
                        </div>
                        <div>
                          <p className="font-mono text-sm text-gray-500">#{order._id.slice(-8)}</p>
                          <p className="font-semibold text-gray-900">{order.userId?.name || "N/A"}</p>
                          <p className="text-sm text-gray-600">{order.userId?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Payment */}
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>

                    {/* Status Dropdown */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Status</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                        {isExpanded ? "Hide" : "View"}
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Products */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Products ({order.products.length})
                        </h4>
                        <div className="space-y-3">
                          {order.products.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                              <img
                                src={p.productId?.image || "/placeholder.png"}
                                alt={p.productId?.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{p.productId?.name}</p>
                                <p className="text-sm text-gray-600">Qty: {p.quantity} × ₹{p.price}</p>
                                {p.variants && Object.keys(p.variants).length > 0 && (
                                  <div className="flex gap-2 mt-1">
                                    {Object.entries(p.variants).map(([key, value]) => (
                                      <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="font-semibold">₹{(p.quantity * p.price).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Payment Info */}
                      <div className="space-y-4">
                        {/* Shipping Address */}
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p className="font-medium">{order.address.fullName}</p>
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                            <p>{order.address.country}</p>
                            <p className="mt-2">📞 {order.address.phone}</p>
                          </div>
                        </div>

                        {/* Payment & Tracking */}
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3">Payment & Tracking</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment Method:</span>
                              <span className="font-medium uppercase">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment Status:</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                              </span>
                            </div>
                            {order.trackingNumber && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tracking:</span>
                                <span className="font-mono font-medium">{order.trackingNumber}</span>
                              </div>
                            )}
                            {order.deliveryDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Expected Delivery:</span>
                                <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            <div className="pt-2 border-t">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Last Updated:</span>
                                <span className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

