import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

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
    createdAt: { type: Date, default: Date.now },
    reviews: [reviewSchema],
});

const Product = mongoose.model('Product', productSchema);
export default Product;