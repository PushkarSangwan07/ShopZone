import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../api';
import { MapPin, ShoppingBag, Tag, ArrowRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCart } = useApi();

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Saved addresses (can be fetched from API later)
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      fullName: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '123 Main Street',
      street: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      isDefault: true
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await getCart(user.userId, user.jwttok);
      if (res.success) {
        setCartData(res.cart);
        // Select default address
        const defaultAddr = savedAddresses.find(addr => addr.isDefault);
        setSelectedAddress(defaultAddr || savedAddresses[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const newAddr = {
      ...newAddress,
      id: Date.now(),
      isDefault: savedAddresses.length === 0
    };
    setSavedAddresses([...savedAddresses, newAddr]);
    setSelectedAddress(newAddr);
    setShowAddressForm(false);
    setNewAddress({
      name: 'Home',
      fullName: '',
      phone: '',
      addressLine1: '',
      street: '',
      city: '',
      state: '',
      postalCode: ''
    });
    toast.success('Address added successfully!');
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(savedAddresses[0]);
    }
    toast.success('Address deleted');
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.info('Coupon feature coming soon!');
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    // Store selected address in sessionStorage for payment page
    sessionStorage.setItem('checkoutAddress', JSON.stringify(selectedAddress));
    sessionStorage.setItem('checkoutCart', JSON.stringify(cartData));
    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!cartData || cartData.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartData.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 499 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

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
              <div className="w-20 h-1 bg-purple-600 mx-2"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="ml-2 font-semibold text-purple-600">Checkout</span>
              </div>
              <div className="w-20 h-1 bg-gray-300 mx-2"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                  3
                </div>
                <span className="ml-2 font-semibold text-gray-500">Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Address Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700"
                >
                  <Plus className="w-5 h-5" />
                  Add New
                </button>
              </div>

              {/* Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="mb-6 p-4 bg-purple-50 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Address Label (e.g., Home, Office)"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      className="col-span-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                      className="col-span-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Name"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      className="col-span-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="postalCode"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses */}
              <div className="space-y-3">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddress(address)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedAddress?.id === address.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={selectedAddress?.id === address.id}
                          onChange={() => setSelectedAddress(address)}
                          className="mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{address.name}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">{address.fullName} | {address.phone}</p>
                          <p className="text-gray-600 text-sm">
                            {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                            {address.city}, {address.state} - {address.postalCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-purple-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartData.products.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.productId?.image?.[0] || '/placeholder.png'}
                      alt={item.productId?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{item.productId?.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-purple-600">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none text-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 text-sm"
                  >
                    Apply
                  </button>
                </div>
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
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinueToPayment}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Continue to Payment
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                🔒 Secure checkout powered by 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;