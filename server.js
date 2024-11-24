const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketIo = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Import cart routes
const Stripe = require('stripe');
const stripe = Stripe('your_stripe_secret_key'); // Replace with your actual Stripe secret key

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); // Use cart routes

// Stripe Payment Endpoint
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle specific events
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Emit notifications (can be triggered based on events in the backend)
    socket.emit('newNotification', { message: 'Welcome to the platform!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

