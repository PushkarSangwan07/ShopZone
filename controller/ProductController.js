const Product = require('../model/Product');


const createProduct = async (req, res) => {
  try {
    let { 
      name, 
      description, 
      price, 
      category, 
      image, 
      stock, 
      variants, 
      isFlashDeal, 
      flashDealPrice, 
      flashDealExpiry,
      mainCategory,   
      subcategory     
    } = req.body;

    
    const imagesArray = Array.isArray(image)
      ? image
      : image
      ? [image]
      : [];

    //  Ensure variants are in correct format
    const variantsArray = Array.isArray(variants) ? variants : [];

    const product = new Product({
      name,
      description,
      price,
      category,
      mainCategory,   
      subcategory,    
      image: imagesArray,
      stock,
      variants: variantsArray,
      isFlashDeal: !!isFlashDeal,
      flashDealPrice,
      flashDealExpiry
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("❌ Error creating product:", err.message);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: err.message
    });
  }
};


// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category"); 
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/products
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      mainCategory,
      subcategory,
      minPrice,
      maxPrice,
      inStock,
      sort = "newest", 
      page = 1,
      limit = 1000,
    } = req.query;

    const filter = {};

    //  Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    //  Category filters
    if (category) filter.category = category;
    if (mainCategory) filter.mainCategory = { $regex: new RegExp(`^${mainCategory}$`, "i") };

    // if (mainCategory) filter.mainCategory = mainCategory;
    if (subcategory) filter.subcategory = subcategory;

    //  Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    //  In stock filter
    if (inStock === "true") filter.stock = { $gt: 0 };

    //  Sorting
    let sortObj = {};
    switch (sort) {
      case "price_asc":
        sortObj = { price: 1 };
        break;
      case "price_desc":
        sortObj = { price: -1 };
        break;
      case "sales":
        sortObj = { sales: -1 };
        break;
      case "newest":
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    //  Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: err.message,
    });
  }
};


// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: err.message
    });
  }
};



// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: err.message
    });
  }
};



const getFlashDeals = async (req, res) => {
  // console.log("GET /products/flash-deals called"); // <--- Debug log
  try {
    const now = new Date();
    const flashDeals = await Product.find({
      isFlashDeal: true,
      flashDealExpiry: { $gte: now }
    });

    // console.log("Found flash deals:", flashDeals);
    res.json({
      success: true,
      count: flashDeals.length,
      flashDeals
    });
  } catch (err) {
    console.error("Error in getFlashDeals:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching flash deals",
      error: err.message
    });
  }
};


// Update product (with flash deal support)
const updateProduct = async (req, res) => {
  try {
    const updateFields = { ...req.body };

    // Handle flash deal updates explicitly
    if (req.body.isFlashDeal !== undefined) {
      updateFields.isFlashDeal = req.body.isFlashDeal;
    }
    if (req.body.flashDealPrice !== undefined) {
      updateFields.flashDealPrice = req.body.flashDealPrice;
    }
    if (req.body.flashDealExpiry !== undefined) {
      updateFields.flashDealExpiry = req.body.flashDealExpiry;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: err.message
    });
  }
};



// GET /api/offers
 const getOffers = async (req, res) => {
  try {
    const offers = await Product.find({ isOffer: true });
    res.json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFlashDeals,
  getOffers,
  getCategories
};
