const express = require('express');
const { addToCart, getCart, updateCart, removeFromCart } = require('../controller/CartController');

const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCart);
router.put("/:userId/:productId", updateCart);
router.delete("/:userId/:productId", removeFromCart);

module.exports = router;
