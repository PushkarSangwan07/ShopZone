const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: [String],
  stock: {
    type: Number,
    required: true,
    default: 0
  },
   // 🔥 Flash deal fields
  isFlashDeal: { type: Boolean, default: false },
  flashDealPrice: { type: Number },
  flashDealExpiry: { type: Date },

// Variants
  variants: [
    {
      name: String,          // e.g., "Color", "Storage", "Size"
      options: [
        {
          value: String,     // e.g., "Red", "128GB", "M"
          price: Number,     // optional price adjustment
          stock: Number      // stock per variant
        }
      ]
    }
  ],

  sales: { type: Number, default: 0 }, 

  mainCategory: {
    type: String,
    enum: ["Men", "Women", "Children", "Mobiles","Fashion", "Electronics", "Home & Living", "Appliances", "Sports & Fitness", "Books & Media"],
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },


}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);
