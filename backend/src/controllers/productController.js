import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const createProduct = async (req, res) => {
    const product = new Product(req.body);
    const created = await product.save();
    res.status(201).json(created);
};

export const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        Object.assign(product, req.body);
        const updated = await product.save();
        res.json(updated);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};
