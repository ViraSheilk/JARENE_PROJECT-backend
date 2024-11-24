const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const router = express.Router();

// Add a review
router.post('/', async (req, res) => {
    const { productId, buyerId, rating, comment } = req.body;
    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Create the review
        const review = new Review({ product: productId, buyer: buyerId, rating, comment });
        await review.save();

        // Update the product's average rating
        const reviews = await Review.find({ product: productId });
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        product.rating = averageRating;
        await product.save();

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('buyer', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;