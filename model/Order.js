const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    
    products: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product",
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true,
          min: 1 
        },
        price: { 
          type: Number, 
          required: true 
        },
        // Variants (flexible for different product types)
        variants: {
          type: mongoose.Schema.Types.Mixed,
          default: {}
        }
      }
    ],
    
    // Address (matches CheckoutPage)
    address: {
      fullName: { 
        type: String, 
        required: true,
        trim: true 
      },
      phone: { 
        type: String, 
        required: true,
        trim: true 
      },
      street: { 
        type: String, 
        required: true,
        trim: true 
      },
      city: { 
        type: String, 
        required: true,
        trim: true 
      },
      state: { 
        type: String, 
        required: true,
        trim: true 
      },
      postalCode: { 
        type: String, 
        required: true,
        trim: true 
      },
      country: { 
        type: String, 
        required: true,
        default: 'India',
        trim: true 
      }
    },
    
    // Payment details
    totalAmount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "wallet", "cod"],
      required: true,
      default: "cod"
    },
    
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending"
    },
    
    // Order status
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },
    
    // Additional fields
    trackingNumber: {
      type: String,
      default: null
    },
    
    deliveryDate: {
      type: Date,
      default: null
    },
    
    notes: {
      type: String,
      default: ""
    }
  },
  { 
    timestamps: true // Adds createdAt and updatedAt
  }
);

// Indexes for faster queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Virtual for order ID display
orderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

module.exports = mongoose.model("Order", orderSchema);

