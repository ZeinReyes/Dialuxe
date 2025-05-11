import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

const socket = io('http://localhost:5000');

const RiderOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isRouteButtonVisible, setIsRouteButtonVisible] = useState(false);
    const [riderLocation, setRiderLocation] = useState({ lat: 14.6091, lon: 121.0223 });
    const [customerLocation, setCustomerLocation] = useState(null);
    const [deliveryPhotos, setDeliveryPhotos] = useState({});

    const navigate = useNavigate();

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

        socket.on('location', (newLocation) => {
            setRiderLocation(newLocation);
        });

        const interval = setInterval(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const coords = {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                    };
                    setRiderLocation(coords);
                    socket.emit('update-location', coords);
                });
            }
        }, 5000);

        return () => {
            socket.off('location');
            clearInterval(interval);
        };
    }, []);

    const handleStartDelivery = async (orderId, customerLat, customerLon) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}/deliver`);
            setSuccess(`Order ${res.data._id} is now in Delivering status.`);
            fetchOrders();
            setCustomerLocation({ lat: customerLat, lon: customerLon });
            setIsRouteButtonVisible(true);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const coords = {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                    };
                    setRiderLocation(coords);
                    socket.emit('update-location', coords);
                });
            }
        } catch (err) {
            setError('Failed to update order status.');
        }
    };

    const handlePhotoChange = (orderId, file) => {
        setDeliveryPhotos(prev => ({ ...prev, [orderId]: file }));
    };

    const handleSubmitProof = async (orderId) => {
        const file = deliveryPhotos[orderId];
        if (!file) {
            setError('Please select a photo before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await axios.post(`http://localhost:5000/api/orders/${orderId}/deliver-proof`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess(`Order ${res.data._id} has been marked as Delivered.`);
            fetchOrders();
            setDeliveryPhotos(prev => {
                const newPhotos = { ...prev };
                delete newPhotos[orderId];
                return newPhotos;
            });
        } catch (err) {
            setError('Failed to upload photo or mark as delivered.');
        }
    };

    const getGoogleMapsURL = () => {
        if (riderLocation && customerLocation) {
            const origin = `${riderLocation.lat},${riderLocation.lon}`;
            const destination = `${customerLocation.lat},${customerLocation.lon}`;
            return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        }
        return '#';
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
                                <td>{order._id}</td>
                                <td>{order.name}</td>
                                <td>{order.address}</td>
                                <td>₱{order.totalAmount.toLocaleString()}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.status === 'Pending' && order.latitude && order.longitude && (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleStartDelivery(order._id, order.latitude, order.longitude)}
                                        >
                                            Start Delivery
                                        </Button>
                                    )}
                                    {order.status === 'Delivering' && (
                                        <>
                                            <Form.Group controlId={`proof-${order._id}`} className="mb-2">
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoChange(order._id, e.target.files[0])}
                                                />
                                            </Form.Group>
                                            <Button
                                                variant="success"
                                                onClick={() => handleSubmitProof(order._id)}
                                            >
                                                Submit Proof
                                            </Button>
                                        </>
                                    )}
                                    {order.status === 'Delivered' && (
                                        <span className="text-success fw-bold">Completed</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {isRouteButtonVisible && riderLocation && customerLocation && (
                <div className="mt-4">
                    <h4>Delivery Route</h4>
                    <Button
                        variant="primary"
                        href={getGoogleMapsURL()}
                        target="_blank" 
                    >
                        View Route in Google Maps
                    </Button>
                </div>
            )}
        </div>
    );
};

export default RiderOrders;
