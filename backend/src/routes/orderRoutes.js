import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, address, contact, payment_method, items, totalAmount } = req.body;

        const newOrder = new Order({
            name,
            address,
            contact,
            payment_method,
            items,
            totalAmount,
            status: 'Pending',
        });

        await newOrder.save();

        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, {
                $inc: { stock: -item.quantity },
            });
        }

        res.status(201).json({ message: 'Order placed and stock updated successfully' });
    } catch (error) {
        console.error('Order saving error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

router.patch('/:id/deliver', async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: 'Delivering' },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
});

export default router;
