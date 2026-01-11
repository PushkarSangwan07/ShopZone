import React from 'react';
import { Award, Users, Zap, Shield, TrendingUp, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const stats = [
    { icon: Users, value: '100K+', label: 'Happy Customers' },
    { icon: Award, value: '500+', label: 'Products' },
    { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' },
    { icon: Zap, value: '24/7', label: 'Support' }
  
  ];

  const navigate = useNavigate()

  const handleOnClick = ()=>{
    navigate("/")
  }
  

  const values = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with bank-level security'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make puts our customers at the center'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'Only the best products make it to our platform'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Lightning-fast delivery to your doorstep'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            About <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">ShopZone</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing online shopping with cutting-edge technology and unmatched customer service
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <stat.icon className="w-10 h-10 md:w-12 md:h-12 text-purple-600 mb-4 mx-auto" />
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Story</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Founded in 2026, ShopZone started with a simple mission: make online shopping effortless, enjoyable, and accessible to everyone.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              What began as a small startup has grown into a thriving marketplace serving over 100,000 happy customers. We've built our reputation on trust, quality, and innovation.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we're proud to offer thousands of premium products, lightning-fast delivery, and 24/7 customer support that actually cares.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop" 
              alt="Our Team" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-xl">
              <div className="text-3xl font-black">5+</div>
              <div className="text-sm font-medium">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <value.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Meet Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            The talented people behind ShopZone's success
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { name: 'Pushkar Sangwan', role: 'CEO & Founder', image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ShopZone' },
            { name: 'Pushkar Sangwan', role: 'Frontend developer', image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ShopZone' },
            { name: 'Pushkar Sangwan', role: 'Backend developer', image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ShopZone' },
          ].map((member, index) => (
            <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-purple-600 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Experience the future of online shopping today
          </p>
          <button onClick={handleOnClick} className="bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
            Start Shopping Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;