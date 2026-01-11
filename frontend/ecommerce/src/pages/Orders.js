import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useApi } from "../api";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  MapPin,
  Calendar,
  Eye
} from "lucide-react";

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const { getOrders, cancelOrder } = useApi();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await getOrders();
        if (res.success) setOrders(res.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, getOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const res = await cancelOrder(orderId);
      if (res.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      card: CreditCard,
      upi: Smartphone,
      wallet: Wallet,
      cod: Banknote
    };
    return icons[method?.toLowerCase()] || Banknote;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      card: 'Credit/Debit Card',
      upi: 'UPI',
      wallet: 'Wallet',
      cod: 'Cash on Delivery'
    };
    return labels[method?.toLowerCase()] || method || 'COD';
  };

  const getStatusDetails = (status) => {
    const statusMap = {
      Pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock,
        label: 'Order Placed'
      },
      Processing: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Package,
        label: 'Processing'
      },
      Shipped: {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Truck,
        label: 'Shipped'
      },
      Delivered: {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Delivered'
      },
      Cancelled: {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
        label: 'Cancelled'
      }
    };
    return statusMap[status] || statusMap.Pending;
  };

  const getPaymentStatusDetails = (status) => {
    const statusMap = {
      Pending: { color: 'bg-orange-100 text-orange-800', label: 'Payment Pending' },
      Paid: { color: 'bg-green-100 text-green-800', label:  'Payment Paid' },
      Failed: { color: 'bg-red-100 text-red-800', label: 'Payment Failed' },
      Refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
    };
    return statusMap[status] || statusMap.Pending;
  };

  const getOrderProgress = (status) => {
    const progress = {
      Pending: 25,
      Processing: 50,
      Shipped: 75,
      Delivered: 100,
      Cancelled: 0
    };
    return progress[status] || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExpectedDelivery = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
          <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-600 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-semibold animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-8">
        <Package className="w-32 h-32 text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-8">Start shopping to see your order history!</p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all transform hover:scale-105"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <Package className="w-10 h-10 text-purple-600" />
            My Orders
          </h1>
          <p className="text-gray-600">{orders.length} {orders.length === 1 ? 'order' : 'orders'} found</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusDetails = getStatusDetails(order.status);
            const paymentDetails = getPaymentStatusDetails(order.paymentStatus);
            const PaymentIcon = getPaymentMethodIcon(order.paymentMethod);
            const StatusIcon = statusDetails.icon;
            const expectedDate = getExpectedDelivery(order.createdAt);
            const progress = getOrderProgress(order.status);
            const isExpanded = expandedOrder === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">Order ID:</span>
                        <span className="font-mono text-sm bg-white px-3 py-1 rounded-full border border-gray-200">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border-2 ${statusDetails.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusDetails.label}
                      </div>
                      <div className={`px-4 py-2 rounded-xl font-bold text-sm ${paymentDetails.color}`}>
                        {paymentDetails.label}
                      </div>
                    </div>
                  </div>
                </div>


                {/* Order Body */}
                <div className="p-6">
                  {/* Products */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.products
                        ?.filter((item) => item?.productId)
                        .slice(0, isExpanded ? undefined : 2)
                        .map((item) => (
                          <div
                            key={item.productId._id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                            onClick={() => navigate(`/product/${item.productId._id}`)}
                          >
                            <img
                              src={item.productId.image?.[0] || "https://placehold.co/100x100/CCCCCC/333333?text=No+Image"}
                              alt={item.productId.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{item.productId.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-purple-600">
                              ₹{((item.displayPrice ?? item.price ?? item.productId.price ?? 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                    </div>
                    {order.products?.length > 2 && (
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                        className="mt-3 text-purple-600 font-semibold text-sm hover:text-purple-700 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        {isExpanded ? 'Show Less' : `View ${order.products.length - 2} More Items`}
                      </button>
                    )}
                  </div>

                  {/* Payment & Delivery Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Payment Method */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white p-2 rounded-lg">
                          <PaymentIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Payment Method</p>
                          <p className="font-bold text-gray-900">{getPaymentMethodLabel(order.paymentMethod)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Delivery Address</p>
                          <p className="font-bold text-gray-900">{order.address.fullName}</p>

                          <p className="font-bold text-gray-900">{order.address?.city}, {order.address?.state}</p>
                          <p className="font-bold text-gray-900">{order.address?.postalCode}</p>
                          <p className="font-bold text-gray-900">Phone: {order.address.phone}</p>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && order.address && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                      <h4 className="font-bold text-gray-900 mb-3">Full Delivery Address</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p className="font-semibold">{order.address.fullName}</p>
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state} - {order.address.postalCode}</p>
                        <p>{order.address.country}</p>
                        <p className="font-medium mt-2">Phone: {order.address.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Total & Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-3xl font-black text-purple-600">
                        ₹{order.totalAmount?.toFixed(2) ?? "0.00"}
                      </p>
                      {expectedDate && (
                        <p className="text-xl text-gray-600 mt-1">
                         Delivery Expected by: {formatDate(expectedDate)}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
                        >
                          Cancel Order
                        </button>
                      )}
                     
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
