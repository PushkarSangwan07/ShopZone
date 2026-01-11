const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },

        // Store selected variants (size, color, etc.)
        variants: {
          type: Map,
          of: String, // Example: { size: "M", color: "Blue" }
          default: {},
        },

        //  Add price field to store product price at the time of adding to cart
        price: { type: Number, required: true, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
