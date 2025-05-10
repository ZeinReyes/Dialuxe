import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Form, Button, Container, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
    const { cart, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();
    const [checkoutData, setCheckoutData] = useState({
        name: '',
        address: '',
        contact: '',
        payment_method: 'Cash on Delivery',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCheckoutData({ ...checkoutData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            ...checkoutData,
            items: cart,
            totalAmount: getCartTotal(),
            date: new Date().toISOString(),
            status: 'Pending', 
        };

        try {
            await axios.post('http://localhost:5000/api/orders', orderData);

            clearCart();
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <Link to="/cart" className="text-decoration-none mb-3 d-inline-block text-primary">
                &larr; Back to Shopping Cart
            </Link>
            <Row className="g-0 rounded overflow-hidden border">
                {/* Order Summary */}
                <Col md={6} style={{ backgroundColor: '#001F3F' }} className="text-white p-4 d-flex flex-column justify-content-between">
                    <div>
                        <h4 className="mb-4">Order Summary</h4>
                        <ListGroup variant="flush">
                            {cart.length > 0 ? (
                                cart.map((item, index) => (
                                    <ListGroup.Item key={index} className="bg-transparent text-white border-0 ps-0">
                                        {item.quantity}x {item.name}
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item className="bg-transparent text-white border-0 ps-0">
                                    Your cart is empty.
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                    <div className="d-flex justify-content-between mt-4 px-1">
                        <strong>Total Amount:</strong>
                        <span>₱{getCartTotal().toLocaleString()}</span>
                    </div>
                </Col>

                <Col md={6} className="bg-white p-4">
                    <h4 className="mb-4">Enter your shipping details</h4>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="address" required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="text" name="contact" required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Control type="text" value="Cash on Delivery" disabled readOnly />
                        </Form.Group>
                        <Button
                            variant="dark"
                            type="submit"
                            className="w-100"
                            style={{ backgroundColor: '#001F3F', border: 'none' }}
                        >
                            Place Order
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;
