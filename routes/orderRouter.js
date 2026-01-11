const express = require('express');
const {
  placeOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  paymentSuccess
} = require('../controller/OrderController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// ---------------- USER ROUTES ---------------- //

// Place a new order
router.post('/', authMiddleware, placeOrder);

// Get all orders for logged-in user
router.get('/user/me', authMiddleware, getOrders);

// Get a single order by ID (user or admin)
router.get('/single/:id', authMiddleware, getOrderById);

// Cancel an order (user)
router.put('/:id/cancel', authMiddleware, cancelOrder);

// Payment success endpoint (mock)
router.put('/payment/success/:id', authMiddleware, paymentSuccess);

// ---------------- ADMIN ROUTES ---------------- //

// Update order status (admin only)
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);

// Get all orders with product and user info (admin only)
router.get('/all', authMiddleware, isAdmin, getAllOrders);

// Delete an order (admin only)
router.delete('/:id', authMiddleware, isAdmin, deleteOrder);

module.exports = router;







