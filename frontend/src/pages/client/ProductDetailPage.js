import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
                setReviews(data);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        console.log('Added to cart:', product);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, { rating, comment });
            console.log(data);
            setReviews(prevReviews => [...prevReviews, { rating, comment }]);
            setRating(5); 
            setComment('');
        } catch (error) {
            console.error('Failed to submit review', error);
        }
    };

    if (!product) {
        return (
            <Container className="py-5 text-center">
                <p>Loading product details...</p>
            </Container>
        );
    }

    return (
        <Container className="py-5 mt-5">
            <div className="mb-4">
                <Button
                    variant="link"
                    onClick={() => navigate(-1)}
                    className="text-decoration-none text-primary ps-0"
                >
                    ← Back to Shopping
                </Button>
            </div>
            <Card className="shadow border-0 d-flex flex-md-row flex-column overflow-hidden rounded-4">
                <div className="py-4 d-flex align-items-center justify-content-center" style={{ flex: 0.75, backgroundColor: '#001F3F' }}>
                    <img
                        src={product.image || 'https://via.placeholder.com/600x600'}
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                </div>
                <div className="p-4" style={{ flex: 1 }}>
                    <h3>{product.name}</h3>
                    <p className="text-secondary">{product.description || 'No description available for this product.'}</p>
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Price:</strong> ₱{product.price.toLocaleString()}</p>
                    <Button variant="dark" className="rounded px-5 mt-3" onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default ProductDetailsPage;
