const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const stripe = require('stripe')('your-stripe-secret-key');
const router = express.Router();

// Checkout (place order)
router.post('/checkout', async (req, res) => {
    const { userId, paymentMethodId } = req.body;

    try {
        // Fetch user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // Create payment intent
        const totalAmount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Amount in cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        // Create the order
        const order = new Order({
            buyer: userId,
            seller: cart.items[0].product.seller, // Assuming all products in the cart are from the same seller
            products: cart.items.map((item) => ({ product: item.product._id, quantity: item.quantity })),
            totalPrice: totalAmount,
            status: 'Pending',
        });

        await order.save();

        // Clear the user's cart
        await Cart.deleteOne({ user: userId });

        res.json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;