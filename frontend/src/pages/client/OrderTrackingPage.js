import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import { Spinner, Container, Badge, Button } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useParams, useNavigate } from 'react-router-dom';
import polyline from 'polyline';
import io from 'socket.io-client';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const socket = io('http://localhost:5000');

const RecenterMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) map.setView([lat, lon]);
    }, [lat, lon, map]);
    return null;
};

const OrderTrackingPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [riderLocation, setRiderLocation] = useState(null);
    const [customerLocation, setCustomerLocation] = useState(null);
    const [route, setRoute] = useState(null);

    const storeLocation = { lat: 14.59615095, lon: 120.99056168524857 };

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/orders/track-order/${orderId}`);
            const orderData = res.data;
            setOrder(orderData);

            if (orderData?.riderLatitude && orderData?.riderLongitude) {
                setRiderLocation({ lat: orderData.riderLatitude, lon: orderData.riderLongitude });
            }

            if (orderData?.latitude && orderData?.longitude) {
                setCustomerLocation({ lat: orderData.latitude, lon: orderData.longitude });
            } else {
                setError('Customer location is not available.');
            }

            setLoading(false);
        } catch (err) {
            setError('Failed to load order.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder();

            const interval = setInterval(() => {
                fetchOrder();
            }, 3000); // 3 seconds

            return () => clearInterval(interval);
        }
    }, [orderId]);

    useEffect(() => {
        socket.on('location', (newLocation) => {
            if (newLocation?.lat && newLocation?.lon) {
                setRiderLocation({ lat: newLocation.lat, lon: newLocation.lon });
            }
        });

        return () => {
            socket.off('location');
        };
    }, []);

    useEffect(() => {
        if (riderLocation && customerLocation) {
            const fetchRoute = async () => {
                try {
                    const res = await axios.post(
                        'https://api.openrouteservice.org/v2/directions/driving-car',
                        {
                            coordinates: [
                                [riderLocation.lon, riderLocation.lat],
                                [customerLocation.lon, customerLocation.lat]
                            ]
                        },
                        {
                            headers: {
                                'Authorization': '5b3ce3597851110001cf6248b4d2954774704a74a5f04c29d614bf1b',
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    const routes = res.data.routes;
                    if (routes?.[0]?.geometry) {
                        const decoded = polyline.decode(routes[0].geometry);
                        setRoute(decoded);
                    } else {
                        setError('Failed to decode route.');
                    }
                } catch (err) {
                    setError('Failed to load route.');
                }
            };
            fetchRoute();
        }
    }, [riderLocation, customerLocation]);

    const renderTrackingMap = () => {
        const zoomLevel = 18;
        const isDelivering = order?.status?.toLowerCase() === 'delivering';
        const isPending = order?.status?.toLowerCase() === 'pending';

        if (isPending) {
            return (
                <MapContainer
                    center={[storeLocation.lat, storeLocation.lon]}
                    zoom={zoomLevel}
                    style={{ height: '400px', width: '100%', borderRadius: '8px' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[storeLocation.lat, storeLocation.lon]}>
                        <Popup>Your order is being prepared at this location.</Popup>
                    </Marker>
                </MapContainer>
            );
        }

        if (isDelivering && riderLocation && customerLocation) {
            return (
                <MapContainer
                    center={[riderLocation.lat, riderLocation.lon]}
                    zoom={zoomLevel}
                    style={{ height: '400px', width: '100%', borderRadius: '8px' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterMap lat={riderLocation.lat} lon={riderLocation.lon} />
                    <Marker position={[riderLocation.lat, riderLocation.lon]}>
                        <Popup>Rider is on the way!</Popup>
                    </Marker>
                    <Marker position={[customerLocation.lat, customerLocation.lon]}>
                        <Popup>Customer Location</Popup>
                    </Marker>
                    {route && (
                        <Polyline
                            positions={route.map(([lat, lon]) => [lat, lon])}
                            color="blue"
                            weight={5}
                            opacity={0.7}
                        />
                    )}
                </MapContainer>
            );
        }

        return <div>No tracking information available.</div>;
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    return (
        <Container className="mt-5 pt-5">
            <Button
                variant="outline-primary"
                onClick={() => navigate('/orders')}
                className="mb-3"
            >
                Back to Orders
            </Button>

            <h3 className="mb-4" style={{ fontWeight: '600', fontSize: '1.8rem' }}>Order Tracking</h3>

            <div className="mt-4">{renderTrackingMap()}</div>

            <div className="mt-4">
                <Badge pill bg={order?.status?.toLowerCase() === 'pending' ? 'danger' : 'warning'} style={{ fontSize: '1rem' }}>
                    {order?.status}
                </Badge>
            </div>
        </Container>
    );
};

export default OrderTrackingPage;
