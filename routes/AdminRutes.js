const express = require('express');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Ensure to use your actual JWT secret
        const user = await User.findById(decoded.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Add new product
router.post('/product', isAdmin, async (req, res) => {
    const { name, description, price, category, sellerId } = req.body;
    try {
        const product = new Product({ name, description, price, category, seller: sellerId });
        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

