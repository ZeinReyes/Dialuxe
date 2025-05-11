import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Tab, Tabs, Table, Badge, Button, Modal, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ClientOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [proofImage, setProofImage] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);

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

    const handleShowProof = (image, order) => {
        setProofImage(image);
        setOrderDetails(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setProofImage(''); 
        setOrderDetails(null); 
    };

    const renderOrders = (filteredOrders) => (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredOrders.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center">No orders found.</td>
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
                            <td>
                                <Button
                                    variant="link"
                                    onClick={() => window.open(`https://www.google.com/maps?q=${order.latitude},${order.longitude}`, '_blank')}
                                >
                                    View Location
                                </Button>
                            </td>
                            <td>
                                {order.status.toLowerCase().trim() === 'delivered' && order.proofPhoto ? (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleShowProof(order.proofPhoto, order)}
                                    >
                                        View Proof of Delivery
                                    </Button>
                                ) : ['pending', 'delivering'].includes(order.status.toLowerCase().trim()) ? (
                                    <Link to={`/track-order/${order._id}`}>
                                        <Button variant="info" size="sm">Track Order</Button>
                                    </Link>
                                ) : null}
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

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Proof of Delivery</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <img
                                src={`http://localhost:5000/uploads/proofs/${proofImage}`}
                                alt="Proof of Delivery"
                                className="img-fluid"
                            />
                        </Col>
                        <Col md={6}>
                            {orderDetails && (
                                <>
                                    <h5>Order Details</h5>
                                    <ul>
                                        <li><strong>Date:</strong> {new Date(orderDetails.date).toLocaleString()}</li>
                                        <li><strong>Total Amount:</strong> ₱{orderDetails.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                                        <li><strong>Status:</strong> {orderDetails.status}</li>
                                    </ul>
                                    <h6>Items</h6>
                                    <ul>
                                        {orderDetails.items.map((item, idx) => (
                                            <li key={idx}>{item.name} x {item.quantity}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ClientOrdersPage;
