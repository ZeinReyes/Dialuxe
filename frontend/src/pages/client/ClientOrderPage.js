import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Tab, Tabs, Table, Badge } from 'react-bootstrap';

const ClientOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/orders');
                setOrders(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load orders.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const renderOrders = (filteredOrders) => (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {filteredOrders.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="text-center">No orders found.</td>
                    </tr>
                ) : (
                    filteredOrders.map((order) => (
                        <tr key={order._id}>
                            <td>{new Date(order.date).toLocaleString()}</td>
                            <td>
                                <ul>
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>{item.name} x {item.quantity}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>₱{order.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>
                                <Badge bg={
                                    order.status.toLowerCase() === 'delivered' ? 'success' :
                                        order.status.toLowerCase() === 'delivering' ? 'warning' :
                                            order.status.toLowerCase() === 'pending' ? 'danger' :
                                                'secondary'
                                }>
                                    {order.status}
                                </Badge>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    return (
        <Container className="mt-5 pt-5">
            <Card className="p-4 mt-4 shadow">
                <h3 className="mb-4">My Orders</h3>
                <Tabs defaultActiveKey="ongoing" className="mb-3">
                    <Tab eventKey="ongoing" title="Ongoing Orders">
                        {renderOrders(orders.filter(order => order.status.toLowerCase() !== 'delivered'))}
                    </Tab>
                    <Tab eventKey="history" title="Order History">
                        {renderOrders(orders.filter(order => order.status.toLowerCase() === 'delivered'))}
                    </Tab>
                </Tabs>
            </Card>
        </Container>
    );
};

export default ClientOrdersPage;