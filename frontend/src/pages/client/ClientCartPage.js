import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();
    const navigate = useNavigate();

    const [checkoutData, setCheckoutData] = useState({
        name: '',
        address: '',
        payment_method: 'Cash on Delivery',
    });

    const handleQuantityChange = (id, action) => {
        const item = cart.find(i => i._id === id);
        if (!item) return;

        if (action === 'increase') {
            updateQuantity(id, item.quantity + 1);
        } else if (action === 'decrease') {
            if (item.quantity === 1) {
                removeFromCart(id);
            } else {
                updateQuantity(id, item.quantity - 1);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCheckoutData({ ...checkoutData, [name]: value });
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        console.log('Checkout data:', checkoutData);
        navigate('/checkout');
    };

    return (
        <div className="container mt-5 pt-5">
            <Row>
                <Col className='mb-4' md={8}>
                    <div className="d-flex justify-content-between align-items-center mt-5">
                        <h3 className="mb-0">Shopping Cart</h3>
                        <Button variant="danger" onClick={clearCart}>Empty Cart</Button>
                    </div>
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item._id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                                    <div className="d-flex">
                                        <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded" />
                                        <div className="ms-3">
                                            <h5>{item.name}</h5>
                                            <p className="text-muted mb-1">Price: ₱{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                            <div className="input-group mb-0" style={{ maxWidth: 150 }}>
                                                <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(item._id, 'decrease')}>−</Button>
                                                <input type="text" className="form-control form-control-sm text-center" value={item.quantity} readOnly />
                                                <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(item._id, 'increase')}>+</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="fw-bold">₱{Number(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            ))}
                        </>
                    )}
                </Col>

                <Col className='' md={4}>
                    <Card
                        bg="dark"
                        text="white"
                        className="p-4 rounded"
                        style={{
                            position: 'fixed',
                            top: '150px',
                            right: '40px',
                            width: '450px',
                            height: '300px',
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Card.Body>
                            <div>
                                <Card.Title className='mt-3'>Order Summary</Card.Title>
                                <p>Items: <strong>{getCartCount()}</strong></p>
                                <p>Amount: <strong>₱{Number(getCartTotal()).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></p>
                                <hr className='mt-4' />
                            </div>
                            <Button variant="warning" className="w-100 mb-3 text-light" onClick={handleCheckout}>
                                Proceed to Checkout
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage;
