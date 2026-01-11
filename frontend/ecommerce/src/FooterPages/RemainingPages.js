// ==================== ALL SERVICE PAGES ====================
import React, { useState } from 'react';
import { Truck, Package, Clock, MapPin, Shield, RefreshCw, FileText, HelpCircle, Search, Zap } from 'lucide-react';

// ==================== SHIPPING INFO PAGE ====================

export const ShippingInfo = () => {
  const shippingOptions = [
    {
      icon: Truck,
      title: 'Standard Delivery',
      time: '5-7 Business Days',
      price: 'FREE on orders over ₹499',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Express Delivery',
      time: '2-3 Business Days',
      price: '₹99',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Package,
      title: 'Same Day Delivery',
      time: 'Within 24 Hours',
      price: '₹199 (Select cities)',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Truck className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black mb-4">Shipping Information</h1>
          <p className="text-lg md:text-xl text-white/90">Fast, reliable delivery to your doorstep</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Shipping Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {shippingOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className={`bg-gradient-to-r ${option.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}>
                <option.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-2">⏱️ {option.time}</p>
              <p className="text-purple-600 font-bold text-lg">{option.price}</p>
            </div>
          ))}
        </div>

        {/* Shipping Policy */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Shipping Policy</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Processing Time
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Orders are processed within 24-48 hours. Orders placed on weekends will be processed on the next business day.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Delivery Locations
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We deliver across India. Some remote areas may have extended delivery times.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Order Tracking
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Track your order in real-time from our app or website. You'll receive SMS and email updates at every step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== RETURNS & REFUNDS PAGE ====================
export const ReturnsRefunds = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <RefreshCw className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black mb-4">Returns & Refunds</h1>
          <p className="text-lg md:text-xl text-white/90">Hassle-free returns within 30 days</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">30-Day Return Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer a 30-day return policy on most items. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Return Eligibility</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Item must be unused and in original condition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Original packaging and tags must be intact</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Return must be initiated within 30 days of delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Proof of purchase required</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Refund Process</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <span>Initiate return from your account or contact support</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <span>Pack item securely with original packaging</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <span>Schedule free pickup or drop at nearest location</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
                  <span>Refund processed within 5-7 business days after inspection</span>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Quick Tip</h3>
              <p className="text-gray-700">
                For faster refunds, choose store credit instead of original payment method. Store credit is issued instantly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PRIVACY POLICY PAGE ====================
export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black mb-4">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-white/90">Your privacy is our priority</p>
          <p className="text-sm text-white/70 mt-2">Last updated: January 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Information</h3>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Name, email address, and phone number</li>
              <li>• Billing and shipping addresses</li>
              <li>• Payment information (encrypted)</li>
              <li>• Order history and preferences</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>✓ Process and fulfill your orders</li>
              <li>✓ Send order confirmations and updates</li>
              <li>✓ Improve our products and services</li>
              <li>✓ Personalize your shopping experience</li>
              <li>✓ Send promotional emails (with your consent)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Access your personal data</li>
              <li>• Correct inaccurate information</li>
              <li>• Request deletion of your data</li>
              <li>• Opt-out of marketing communications</li>
              <li>• Export your data in a portable format</li>
            </ul>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Questions About Privacy?</h3>
              <p className="text-gray-700 mb-3">
                Contact our privacy team at privacy@shopzone.com
              </p>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all">
                Contact Privacy Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== TERMS OF SERVICE PAGE ====================
export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black mb-4">Terms of Service</h1>
          <p className="text-lg md:text-xl text-white/90">Our commitment to fair and transparent service</p>
          <p className="text-sm text-white/70 mt-2">Effective date: January 1, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using ShopZone, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                To make purchases, you must create an account. You agree to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Provide accurate and complete information</li>
                <li>• Maintain the security of your password</li>
                <li>• Notify us immediately of any unauthorized access</li>
                <li>• Take responsibility for all activities under your account</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Product Information</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pricing and Payment</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                All prices are in Indian Rupees (₹) and are subject to change without notice. We accept:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Credit/Debit Cards</li>
                <li>✓ UPI</li>
                <li>✓ Net Banking</li>
                <li>✓ Wallets (Paytm, PhonePe, Google Pay)</li>
                <li>✓ Cash on Delivery (select locations)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You may not:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✗ Use our service for any illegal purpose</li>
                <li>✗ Attempt to gain unauthorized access to our systems</li>
                <li>✗ Interfere with other users' access to the service</li>
                <li>✗ Submit false or misleading information</li>
                <li>✗ Scrape or copy content without permission</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                ShopZone shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">📧 Contact Us</h3>
              <p className="text-gray-700 mb-3">
                Questions about our Terms of Service? Reach out to legal@shopzone.com
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                Contact Legal Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== HELP CENTER / FAQ PAGE ====================
// import { HelpCircle, Search } from 'lucide-react';

export const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How can I track my order?',
          a: 'You can track your order from the "My Orders" section in your account. You\'ll also receive tracking updates via SMS and email.'
        },
        {
          q: 'Can I change my delivery address?',
          a: 'Yes, you can change your delivery address before the order is shipped. Go to "My Orders" and click "Modify Address".'
        },
        {
          q: 'What if my order arrives damaged?',
          a: 'Please contact us within 48 hours with photos of the damage. We\'ll arrange a replacement or full refund immediately.'
        }
      ]
    },
    {
      category: 'Payments',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit/debit cards, UPI, net banking, mobile wallets, and cash on delivery.'
        },
        {
          q: 'Is it safe to use my credit card?',
          a: 'Absolutely! All transactions are encrypted with 256-bit SSL. We never store your full card details.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: '30-day hassle-free returns on most items. Item must be unused, in original packaging with tags intact.'
        },
        {
          q: 'How do I initiate a return?',
          a: 'Go to "My Orders", select the item, and click "Return Item". Schedule a free pickup or drop at nearest location.'
        },
        {
          q: 'Are there any items that cannot be returned?',
          a: 'Yes, intimate apparel, cosmetics, and personalized items cannot be returned for hygiene reasons.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black mb-4">Help Center</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">Find answers to common questions</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:ring-4 focus:ring-orange-300 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {faqs.map((category, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-6">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, qIdx) => (
                <div key={qIdx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-2">
                    <span className="text-orange-600">Q:</span>
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed pl-6">
                    <span className="text-orange-600 font-bold">A:</span> {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 text-center text-white mt-12">
          <h2 className="text-3xl font-black mb-4">Still Need Help?</h2>
          <p className="text-lg mb-6">Our support team is here 24/7</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all">
              Chat with Us
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};