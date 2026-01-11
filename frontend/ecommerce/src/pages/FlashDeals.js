// import { useState, useEffect } from "react";
// import { getFlashDeals } from "../api";

// const FlashDeals = () => {
//   const [deals, setDeals] = useState([]);
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   // Fetch flash deals from API
//   const fetchDeals = async () => {
//     const data = await getFlashDeals();
//     setDeals(data);
//   };

//   useEffect(() => {
//     fetchDeals();

//     // Optional: auto-refresh deals every 30s
//     const intervalDeals = setInterval(fetchDeals, 30000);
//     return () => clearInterval(intervalDeals);
//   }, []);

//   // Countdown timer
//   useEffect(() => {
//     if (deals.length === 0) return;

//     // Assuming all deals end at the same time (you can customize per deal)
//     const endTime = new Date(deals[0].endTime); 

//     const interval = setInterval(() => {
//       const now = new Date();
//       const difference = endTime - now;

//       if (difference <= 0) {
//         clearInterval(interval);
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//       } else {
//         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
//         const minutes = Math.floor((difference / 1000 / 60) % 60);
//         const seconds = Math.floor((difference / 1000) % 60);

//         setTimeLeft({ days, hours, minutes, seconds });
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [deals]);

//   return (
//     <div className="relative z-10 max-w-7xl mx-auto px-6">
//       {/* Flash Deals Header */}
//       <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
//         <div className="text-center lg:text-left">
//           <h3 className="text-5xl lg:text-6xl font-black text-white mb-4 flex items-center justify-center lg:justify-start gap-4">
//             ⚡ <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Flash Deals</span>
//           </h3>
//           <p className="text-xl text-white/90 max-w-md">
//             Limited time offers • Exclusive discounts • Premium quality guaranteed
//           </p>
//         </div>

//         {/* Countdown Timer */}
//         <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-6 border border-white/20 shadow-2xl">
//           <span className="text-white/80 text-lg font-medium">Ends in</span>
//           <div className="flex space-x-3">
//             {["days", "hours", "minutes", "seconds"].map((unit) => (
//               <div key={unit} className="text-center">
//                 <span className="text-3xl font-black text-white px-4 py-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg block animate-pulse">
//                   {String(timeLeft[unit]).padStart(2, "0")}
//                 </span>
//                 <span className="text-white/70 text-sm mt-1 block">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Deals Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         {deals.map((deal) => (
//           <div key={deal.id} className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 border border-white/20">
//             <div className="relative overflow-hidden">
//               <img
//                 src={deal.image}
//                 alt={deal.name}
//                 className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
//               />
//               <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
//                 -{deal.discount}%
//               </div>
//             </div>
//             <div className="p-6">
//               <h4 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">{deal.name}</h4>
//               <div className="flex items-center space-x-2 mb-3">
//                 <span className="text-2xl font-black text-red-500">${deal.price}</span>
//                 <span className="text-lg text-gray-400 line-through">${deal.originalPrice}</span>
//               </div>
//               <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
//                 🛒 Grab Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FlashDeals;

