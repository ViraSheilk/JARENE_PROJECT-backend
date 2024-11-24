
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a product (Seller only)
router.post('/', async (req, res) => {
    const { name, description, price, quantity, seller, image } = req.body;
    try {
        const product = new Product({ name, description, price, quantity, seller, image });
        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
// Search and filter products
router.get('/search', async (req, res) => {
    const { name, minPrice, maxPrice } = req.query;
    const filter = {};

    if (name) {
        filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;
    }

    try {
        const products = await Product.find(filter).populate('seller', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});