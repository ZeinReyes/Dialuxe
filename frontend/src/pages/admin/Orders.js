import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data);
        } catch (err) {
            setError('Failed to fetch orders. Please try again later.');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`http://localhost:5000/api/orders/${id}`);
                fetchOrders();
            } catch (err) {
                setError('Failed to delete order.');
            }
        }
    };

    return (
        <div className="container">
            <h3 className="mb-4">Manage Orders</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th style={{ width: '150px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center">No orders found</td>
                        </tr>
                    ) : (
                        orders.map((order, idx) => (
                            <tr key={order._id}>
                                <td>{idx + 1}</td>
                                <td>{order.name}</td>
                                <td>{order.contact}</td>
                                <td>{order.address}</td>
                                <td>₱{order.totalAmount.toLocaleString()}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.date).toLocaleString()}</td>
                                <td>
                                    <ul className="list-unstyled mb-0">
                                        {order.items.map((item, i) => (
                                            <li key={i}>
                                                {item.name} × {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(order._id)}>
                                        <i className="bi bi-trash me-2"></i>Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default Orders;