const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();

// Place an order
router.post('/', async (req, res) => {
    const { productId, quantity, buyerId } = req.body;
    try {
        // Find product
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        // Check if quantity is available
        if (product.quantity < quantity) {
            return res.status(400).json({ error: "Not enough stock available" });
        }

        // Find the seller of the product
        const seller = await User.findById(product.seller);

        // Calculate total price
        const totalPrice = product.price * quantity;

        // Create an order
        const order = new Order({
            product: productId,
            buyer: buyerId,
            seller: product.seller,
            quantity,
            totalPrice
        });

        // Save the order and update the product quantity
        await order.save();
        product.quantity -= quantity;
        await product.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get orders by seller
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.params.sellerId }).populate('buyer', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get orders by buyer
router.get('/buyer/:buyerId', async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.params.buyerId }).populate('product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
const auth = require('../middleware/auth');

// Apply auth middleware to routes
router.post('/', auth, async (req, res) => {
    // Order placement logic
});

router.get('/seller/:sellerId', auth, async (req, res) => {
    // Seller orders logic
});