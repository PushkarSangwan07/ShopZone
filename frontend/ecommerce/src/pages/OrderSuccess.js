import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // In a real app, fetch order details from API
    // For now, using mock data
    setOrderData({
      orderId: orderId,
      orderDate: new Date().toLocaleDateString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      total: '₹2,499'
    });
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full animate-ping opacity-25 mx-auto"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Order Placed <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Successfully!</span>
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for shopping with us! Your order has been confirmed.
          </p>
          <p className="text-sm text-gray-500">
            Order ID: <span className="font-mono font-bold text-purple-600">#{orderId}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-bold text-gray-900">{orderData?.orderDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
              <p className="font-bold text-green-600">{orderData?.estimatedDelivery}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-3xl font-black text-gray-900">{orderData?.total}</p>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Status</h3>
          <div className="space-y-6">
            {[
              { icon: CheckCircle, label: 'Order Confirmed', status: 'completed', time: 'Just now' },
              { icon: Package, label: 'Packed', status: 'pending', time: 'Within 24 hrs' },
              { icon: Truck, label: 'Shipped', status: 'pending', time: '2-3 days' },
              { icon: Home, label: 'Delivered', status: 'pending', time: '5-7 days' }
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
                }`}>
                  <step.icon className={`w-6 h-6 ${
                    step.status === 'completed' 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${
                    step.status === 'completed' 
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-600">{step.time}</p>
                </div>
                {step.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            View Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-white border-2 border-gray-300 text-gray-900 py-4 rounded-2xl font-bold hover:border-purple-600 hover:text-purple-600 transition-all"
          >
            Continue Shopping
          </button>
          <button
            className="bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Invoice
          </button>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 border-2 border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📧 What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>Track your order from "My Orders" section</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>We'll notify you when your order is shipped</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>Rate your purchase after delivery</span>
            </li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <button className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;