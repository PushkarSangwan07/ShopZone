// const Order = require("../model/Order");
// const Cart = require("../model/Cart");

// const initiatePayment = async (req, res) => {
//   try {
//     const { orderId, method } = req.body;
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     order.paymentMethod = method || "Online";
//     order.paymentStatus = "Pending";
//     await order.save();

//     res.json({
//       success: true,
//       message: `Payment initiated using ${order.paymentMethod}`,
//       order
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error initiating payment", error: err.message });
//   }
// };

// // Mock success
// const paymentSuccess = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     order.paymentStatus = "Paid";
//     order.status = "Processing"; // move order forward
//     await order.save();

//     res.json({ success: true, message: "Payment successful", order });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error updating payment", error: err.message });
//   }
// };

// // Mock failure → Auto cancel + restore items
// const paymentFailure = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.orderId).populate("products.productId");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Mark payment failed
//     order.paymentStatus = "Failed";

//     // Cancel the order
//     order.status = "Cancelled";

//     // Restore items to cart
//     let cart = await Cart.findOne({ userId: order.userId });
//     if (!cart) {
//       cart = new Cart({ userId: order.userId, products: [] });
//     }

//     order.products.forEach(item => {
//       const existingItem = cart.products.find(
//         p => p.productId.toString() === item.productId._id.toString()
//       );
//       if (existingItem) {
//         existingItem.quantity += item.quantity;
//       } else {
//         cart.products.push({ productId: item.productId._id, quantity: item.quantity });
//       }
//     });

//     await cart.save();
//     await order.save();

//     res.json({
//       success: true,
//       message: "Payment failed → Order cancelled and items restored to cart",
//       order
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error handling payment failure", error: err.message });
//   }
// };

// module.exports = { initiatePayment, paymentSuccess, paymentFailure };
