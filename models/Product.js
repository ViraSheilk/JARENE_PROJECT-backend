
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String }, // URL to the product image
});
modules.export = mongoose.model ('Product',productSchema);