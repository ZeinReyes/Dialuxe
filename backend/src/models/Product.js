import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    brand: {
        type: String,
        enum: ['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Cartier'],
        required: true
    },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;