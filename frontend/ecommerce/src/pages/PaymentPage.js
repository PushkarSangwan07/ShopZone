import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../api';
import { CreditCard, Smartphone, Wallet, Banknote, Shield, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { placeOrder } = useApi();

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState('');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      recommended: true
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'wallet',
      name: 'Wallets',
      icon: Wallet,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Banknote,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get checkout data from sessionStorage
    const address = JSON.parse(sessionStorage.getItem('checkoutAddress'));
    const cart = JSON.parse(sessionStorage.getItem('checkoutCart'));

    if (!address || !cart) {
      toast.error('No checkout data found');
      navigate('/cart');
      return;
    }

    setCheckoutData({ address, cart });
  }, [user, navigate]);

  const handleCardInputChange = (e) => {
    let { name, value } = e.target;

    // Format card number
    if (name === 'number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Format expiry
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Format CVV
    if (name === 'cvv' && value.length > 3) return;

    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePlaceOrder = async () => {
    if (!checkoutData) return;

    // Validation based on payment method
    if (selectedMethod === 'card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill all card details');
        return;
      }
    } else if (selectedMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        address: checkoutData.address,
        products: checkoutData.cart.products.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: selectedMethod,
        totalAmount: calculateTotal()
      };

      const res = await placeOrder(orderData);

      if (res.success) {
        // Clear sessionStorage
        sessionStorage.removeItem('checkoutAddress');
        sessionStorage.removeItem('checkoutCart');

        // Navigate to success page
        navigate(`/order-success/${res.order._id}`);
        toast.success('Order placed successfully!');
      } else {
        toast.error(res.message || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error placing order');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!checkoutData) return 0;
    const subtotal = checkoutData.cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 499 ? 0 : 50;
    const tax = subtotal * 0.18;
    return subtotal + shipping + tax;
  };

  if (!checkoutData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const subtotal = checkoutData.cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 499 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="ml-2 font-semibold text-green-600">Cart</span>
              </div>
              <div className="w-20 h-1 bg-green-500 mx-2"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="ml-2 font-semibold text-green-600">Checkout</span>
              </div>
              <div className="w-20 h-1 bg-purple-600 mx-2"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <span className="ml-2 font-semibold text-purple-600">Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/checkout')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Checkout
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-purple-600" />
                Select Payment Method
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {method.recommended && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        Recommended
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">{method.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Forms */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="number"
                    placeholder="Card Number"
                    value={cardDetails.number}
                    onChange={handleCardInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={handleCardInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={handleCardInputChange}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      maxLength="3"
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'upi' && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., yourname@paytm)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Popular UPI apps: PhonePe, Google Pay, Paytm, BHIM
                  </p>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div className="grid grid-cols-3 gap-4">
                  {['Paytm', 'PhonePe', 'Google Pay'].map((wallet) => (
                    <button
                      key={wallet}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all"
                    >
                      <div className="text-center font-semibold text-gray-900">{wallet}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedMethod === 'cod' && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                  <p className="text-orange-800 font-semibold mb-2">💰 Cash on Delivery</p>
                  <p className="text-sm text-orange-700">
                    Pay with cash when your order is delivered. Extra ₹50 COD charges may apply.
                  </p>
                </div>
              )}
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-green-600" />
              <span>256-bit SSL Encrypted Payment</span>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

              {/* Delivery Address */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Delivering to:</p>
                <p className="font-semibold text-sm text-gray-900">{checkoutData.address.fullName}</p>
                <p className="text-xs text-gray-600">
                  {checkoutData.address.addressLine1}, {checkoutData.address.city} - {checkoutData.address.pincode}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                {selectedMethod === 'cod' && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Charges</span>
                    <span>₹50</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{(selectedMethod === 'cod' ? total + 50 : total).toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                🔒 100% Secure Payment • PCI DSS Compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;