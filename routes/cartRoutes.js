const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const productIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (productIndex >= 0) {
            cart.items[productIndex].quantity += quantity; // Update quantity if item already exists
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        res.json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const productIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (productIndex >= 0) {
            cart.items[productIndex].quantity += quantity; // Update quantity if item already exists
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        res.json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

