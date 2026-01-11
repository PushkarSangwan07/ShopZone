const Cart = require('../model/Cart');
const Product = require('../model/Product');
const mongoose = require('mongoose');


// ---------- Add to Cart ----------
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, variants, price } = req.body;

    // console.log("🔹 Request to addToCart:", { userId, productId, quantity, variants, price });

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      // console.log("❌ Invalid userId or productId");
      return res.status(400).json({ success: false, message: "Invalid userId or productId" });
    }

    const qty = Number(quantity) || 1;

    // Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      // console.log("❌ Product not found:", productId);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    //   Determine effective price with safe fallback
    let priceToUse = product.price;

    if (product.isFlashDeal) {
      if (product.flashDealPrice && product.flashDealPrice > 0) {
        priceToUse = product.flashDealPrice;
      } else {
        console.warn(`⚠️ Flash deal product "${product.name}" has invalid price, using regular price instead`);
        priceToUse = product.price;
      }
    }

    //   If frontend provides a variant-specific price, use that instead
    if (price && price > 0) {
      priceToUse = price;
    }

    // console.log("🔹 Final price used:", priceToUse);

    // Find or create cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity: qty, variants, price: priceToUse }],
      });
      // console.log("🟢 Created new cart with product");
    } else {
      const itemIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          JSON.stringify(p.variants || {}) === JSON.stringify(variants || {})
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += qty;
        cart.products[itemIndex].price = priceToUse;
        // console.log("🟢 Updated existing cart item quantity and price");
      } else {
        cart.products.push({ productId, quantity: qty, variants, price: priceToUse });
        // console.log("🟢 Added new product to existing cart");
      }
    }

    await cart.save();

    const populatedCart = await cart.populate("products.productId");

    // console.log("  Cart saved successfully:", populatedCart);
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (err) {
    console.error("❌ Error in addToCart:", err);
    res.status(500).json({ success: false, message: "Error adding to cart", error: err.message });
  }
};



// ---------- Update Cart ----------
const updateCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity, variants } = req.body;

    // console.log("🔹 Request to updateCart:", { userId, productId, quantity, variants });

    if (quantity <= 0) {
      // console.log("❌ Invalid quantity:", quantity);
      return res.status(400).json({ success: false, message: "Quantity must be > 0" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        JSON.stringify(p.variants || {}) === JSON.stringify(variants || {})
    );

    if (productIndex === -1) return res.status(404).json({ success: false, message: "Cart item not found" });

    const product = await Product.findById(productId);
    let price = product.price;
    if (product.isFlashDeal && product.flashDealPrice) price = product.flashDealPrice;


    cart.products[productIndex].quantity = quantity;
    cart.products[productIndex].price = price;

    await cart.save();
    // console.log("  Cart updated successfully");
    res.json({ success: true, cart });
  } catch (err) {
    console.error("❌ Error in updateCart:", err);
    res.status(500).json({ success: false, message: "Error updating cart", error: err.message });
  }
};



// ---------- Get Cart ----------

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate({
        path: "products.productId",
        select: "name price image",
      })
      .lean(); //   Return plain JS object (faster)

    if (!cart)
      return res.status(404).json({ success: false, message: "Cart not found" });

    // Filter out null or deleted products
    const productsWithPrice = cart.products
      .filter((item) => item.productId)
      .map((item) => ({
        ...item,
        price: item.price,
        name: item.productId.name,
        image: item.productId.image,
      }));

    return res.json({
      success: true,
      cart: { ...cart, products: productsWithPrice },
    });
  } catch (err) {
    console.error("❌ Error in getCart:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching cart", error: err.message });
  }
};





// ---------- Remove from Cart ----------
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { variants } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) =>
        !(
          p.productId.toString() === productId &&
          JSON.stringify(p.variants || {}) === JSON.stringify(variants || {})
        )
    );

    await cart.save();
    // console.log("  Cart item removed successfully");
    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (err) {
    console.error("❌ Error in removeFromCart:", err);
    res.status(500).json({ success: false, message: "Error removing from cart", error: err.message });
  }
};

module.exports = { addToCart, updateCart, getCart, removeFromCart };

