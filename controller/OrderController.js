const Order = require('../model/Order');
const Cart = require('../model/Cart');
const mongoose = require("mongoose");


const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod } = req.body; 

    //   Validate address with new field names
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    //   Validate required address fields (matching new schema)
    const requiredFields = ['fullName', 'phone', 'street', 'city', 'state', 'postalCode'];
    for (const field of requiredFields) {
      if (!address[field]) {
        return res.status(400).json({
          success: false,
          message: `Address field '${field}' is required`,
        });
      }
    }

    //   Set default country if not provided
    if (!address.country) {
      address.country = 'India';
    }

    //  Fetch user's cart with product details (include flash deal info)
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "products.productId",
        select: "name price flashDealPrice isFlashDeal _id",
      });

    if (!cart || !cart.products || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    //  Filter out invalid or deleted products
    const validProducts = cart.products.filter(
      (p) => p.productId && (p.price > 0 || p.productId.price > 0 || p.productId.flashDealPrice > 0)
    );

    if (validProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart has no valid products",
      });
    }

    

    //  Build order items with correct price
    const orderProducts = validProducts.map((p) => {
      const product = p.productId;
      
      //   Always prefer cart price first
      let priceToUse = p.price;

      //   Fallbacks
      if (!priceToUse || priceToUse <= 0) {
        if (product.isFlashDeal && product.flashDealPrice && product.flashDealPrice > 0) {
          priceToUse = product.flashDealPrice;
        } else {
          priceToUse = product.price || 0;
        }
      }


      return {
        productId: product._id,
        quantity: p.quantity,
        variants: p.variants || {}, 
        price: priceToUse,
      };
    });

    //   Calculate total order amount
    const totalAmount = orderProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    //  Create the order with new schema
    const order = new Order({
      userId,
      products: orderProducts,
      totalAmount,
      status: "Pending",
      address: {
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country || 'India'
      },
      paymentMethod: paymentMethod || 'cod', 
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid' 
    });

    await order.save();

    //  Clear user's cart after successful order
    cart.products = [];
    await cart.save();

    

    //   Respond with success
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: err.message,
    });
  }
};



const getOrders = async (req, res) => {
  try {
    const userId = req.user._id; 

    const orders = await Order.find({ userId })
      .populate({
        path: "products.productId",
        select: "name image price flashDealPrice isFlashDeal",
      })
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    //   Merge stored order price with populated product info (handles flash deal & zero price)
    const formattedOrders = orders.map((order) => ({
      ...order,
      products: order.products.map((p) => {
        let finalPrice = p.price; // prefer saved order price first

        if (!finalPrice || finalPrice <= 0) {
          if (p.productId?.isFlashDeal && p.productId?.flashDealPrice > 0) {
            finalPrice = p.productId.flashDealPrice;
          } else {
            finalPrice = p.productId?.price || 0;
          }
        }

        return {
          ...p,
          price: finalPrice,
          name: p.productId?.name ?? "Unknown Product",
          image: p.productId?.image ?? "",
        };
      }),
    }));

    res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: err.message,
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "products.productId",
        select: "name image price flashDealPrice isFlashDeal",
      })
      .populate("userId", "name email")
      .lean();

    const formattedOrders = orders.map((order) => ({
      ...order,
      products: order.products.map((p) => ({
        ...p,
        price: p.price ?? p.productId?.price ?? 0,
      })),
    }));

    res.status(200).json({ success: true, orders: formattedOrders });
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching all orders",
      error: err.message,
    });
  }
};


const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "products.productId",
        select: "name image price flashDealPrice isFlashDeal",
      })
      .populate("userId", "name email") 
      .lean();

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    const orderUserId = order.userId?._id?.toString() || order.userId?.toString();
    
    if (orderUserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized to view this order" 
      });
    }

    // Format the order (same pattern as getAllOrders)
    const formattedOrder = {
      ...order,
      products: order.products.map((p) => ({
        ...p,
        productId: p.productId || null, 
        price: p.price ?? p.productId?.price ?? 0,
        displayPrice: p.productId?.isFlashDeal 
          ? p.productId.flashDealPrice 
          : p.productId?.price ?? p.price ?? 0,
      })),
    };

    res.json({ success: true, order: formattedOrder });
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching order", 
      error: err.message 
    });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("products.productId");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating order", error: err.message });
  }
};

// Delete order (admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting order", error: err.message });
  }
};

// Cancel order (user)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error cancelling order", error: err.message });
  }
};

// Payment success callback
const paymentSuccess = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "paid" },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order, message: "Payment successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Payment update failed", error: err.message });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  paymentSuccess
};
