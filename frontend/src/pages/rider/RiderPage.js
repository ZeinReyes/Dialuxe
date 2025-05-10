import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';

const RiderOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data);
        } catch (err) {
            setError('Failed to fetch orders.');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStartDelivery = async (orderId) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}/deliver`);
            setSuccess(`Order ${res.data._id} is now in Delivering status.`);
            fetchOrders(); 
        } catch (err) {
            setError('Failed to update order status.');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Rider Page</h3>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">No orders available</td>
                        </tr>
                    ) : (
                        orders.map((order, idx) => (
                            <tr key={order._id}>
                                <td>{idx + 1}</td>
                                <td>{order._id}</td> {/* Display Order ID */}
                                <td>{order.name}</td>
                                <td>{order.address}</td>
                                <td>₱{order.totalAmount.toLocaleString()}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.status === 'Pending' && (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleStartDelivery(order._id)}
                                        >
                                            Start Delivery
                                        </Button>
                                    )}
                                    {order.status === 'Delivering' && (
                                        <Button variant="success" disabled>
                                            Already Delivering
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default RiderOrders;
