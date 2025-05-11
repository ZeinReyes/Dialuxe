import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Form, Button, Container, Row, Col, ListGroup, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const locationIQKey = process.env.REACT_APP_LOCATIONIQ_API_KEY;

const CheckoutPage = () => {
    const { cart, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [isLocating, setIsLocating] = useState(false);
    const [checkoutData, setCheckoutData] = useState({
        name: '',
        address: '',
        contact: '',
        latitude: null,
        longitude: null, 
        payment_method: 'Cash on Delivery',
    });

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setCheckoutData({ ...checkoutData, [name]: value });

        if (name === 'address' && value.length > 2) {
            try {
                const res = await axios.get(
                    `https://api.locationiq.com/v1/autocomplete.php`,
                    {
                        params: {
                            key: locationIQKey,
                            q: value,
                            limit: 5,
                            countrycodes: 'ph',
                            normalizecity: 1,
                            format: 'json',
                        },
                    }
                );
                setAutocompleteResults(res.data);
            } catch (error) {
                console.error('Autocomplete failed:', error);
            }
        } else {
            setAutocompleteResults([]);
        }
    };

    const handleSuggestionClick = (place) => {
        setCheckoutData({
            ...checkoutData,
            address: place.display_name,
            latitude: place.lat, 
            longitude: place.lon, 
        });
        setAutocompleteResults([]);
    };

    const useMyLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude, longitude } = coords;
                try {
                    const res = await axios.get(
                        `https://us1.locationiq.com/v1/reverse.php`,
                        {
                            params: {
                                key: locationIQKey,
                                lat: latitude,
                                lon: longitude,
                                format: 'json',
                            },
                        }
                    );
                    setCheckoutData({
                        ...checkoutData,
                        address: res.data.display_name,
                        latitude,
                        longitude,
                    });
                } catch (error) {
                    alert('Failed to fetch address.');
                } finally {
                    setIsLocating(false);
                }
            },
            () => {
                alert('Unable to access your location.');
                setIsLocating(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkoutData.name || !checkoutData.address || !checkoutData.contact) {
            alert('Please fill in all required fields.');
            return;
        }

        if (cart.length === 0) {
            alert('Your cart is empty. Add items before proceeding.');
            return;
        }

        const orderData = {
            ...checkoutData,
            items: cart,
            totalAmount: getCartTotal(),
            date: new Date().toISOString(),
            status: 'Pending',
        };

        try {
            const response = await axios.post('http://localhost:5000/api/orders', orderData);
            clearCart();
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            alert('Checkout failed. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <Link to="/cart" className="text-decoration-none mb-3 d-inline-block text-primary">
                &larr; Back to Shopping Cart
            </Link>
            <Row className="g-0 rounded overflow-hidden border">
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

                        <Form.Group className="mb-3 position-relative">
                            <Form.Label>Address</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    required
                                    value={checkoutData.address}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={useMyLocation}
                                    disabled={isLocating}
                                    title="Use My Location"
                                >
                                    📍
                                </Button>
                            </InputGroup>

                            {autocompleteResults.length > 0 && (
                                <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 10 }}>
                                    {autocompleteResults.map((result, idx) => (
                                        <ListGroup.Item
                                            key={idx}
                                            action
                                            onClick={() => handleSuggestionClick(result)}
                                        >
                                            {result.display_name}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
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
