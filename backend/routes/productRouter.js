const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFlashDeals,
  getOffers,
  getCategories
} = require('../controller/ProductController');

const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const productRouter = express.Router();

// Admin routes

productRouter.post('/', authMiddleware, isAdmin, createProduct);     
productRouter.put('/:id', authMiddleware, isAdmin, updateProduct);   
productRouter.delete('/:id', authMiddleware, isAdmin, deleteProduct); 
productRouter.put("/:id", authMiddleware,isAdmin, updateProduct);


// Public routes
productRouter.get('/', getProducts);    
productRouter.get("/flash-deals", getFlashDeals); 
productRouter.get('/offers',getOffers)
productRouter.get('/:id', getProductById);   
productRouter.get("/categories",getCategories)

module.exports = productRouter;
