import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaSearch, FaFilter } from 'react-icons/fa';
import './ClientProductPage.css';

const ClientProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                const inStockProducts = res.data.filter(p => p.stock > 0); 
                setProducts(inStockProducts);
                setFiltered(inStockProducts);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let data = [...products];

        if (search) {
            data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (brandFilter) {
            data = data.filter(p => p.brand === brandFilter);
        }

        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(Number);
            data = data.filter(p => p.price >= min && p.price <= max);
        }

        setFiltered(data);
    }, [search, brandFilter, priceFilter, products]);

    const handleAddToCart = (product) => {
        addToCart(product);
        console.log('Added to cart:', product);
    };

    const handleSort = (order) => {
        const sorted = [...filtered].sort((a, b) =>
            order === 'low-high' ? a.price - b.price : b.price - a.price
        );
        setFiltered(sorted);
    };

    return (
        <div className="container py-5 mt-5">
            <Row className="mt-5 mb-4 d-flex align-items-center">
                <Col md={11}>
                    <InputGroup className='w-100'>
                        <InputGroup.Text className="bg-white py-3 border-0 rounded-start-pill">
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Search for a watch"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-0 rounded-end-pill"
                        />
                    </InputGroup>
                </Col>

                <Col md="auto">
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="dark" className="rounded-pill px-4">
                            <FaFilter />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow p-3" style={{ minWidth: '250px' }}>
                            <div className="mb-2">
                                <Form.Label><strong>Filter by Brand</strong></Form.Label>
                                <Form.Select
                                    value={brandFilter}
                                    onChange={(e) => setBrandFilter(e.target.value)}
                                >
                                    <option value="">All Brands</option>
                                    <option>Rolex</option>
                                    <option>Patek Philippe</option>
                                    <option>Audemars Piguet</option>
                                    <option>Cartier</option>
                                </Form.Select>
                            </div>
                            <div>
                                <Form.Label><strong>Sort by Price</strong></Form.Label>
                                <Form.Select onChange={(e) => handleSort(e.target.value)}>
                                    <option value="">None</option>
                                    <option value="low-high">Low to High</option>
                                    <option value="high-low">High to Low</option>
                                </Form.Select>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            <Row>
                {filtered.length === 0 ? (
                    <Col>
                        <p className="text-center text-muted">No products found.</p>
                    </Col>
                ) : (
                    filtered.map((product) => (
                        <Col md={4} lg={3} className="mb-4" key={product._id}>
                            <Card className="shadow-sm border-light rounded product-card">
                                <Card.Img
                                    variant="top"
                                    src={product.image || 'https://via.placeholder.com/300x300'}
                                    className="card-image"
                                />
                                <Card.Body>
                                    <Card.Title className="h5 text-dark">{product.name}</Card.Title>
                                    <Card.Text className="text-muted mb-1">
                                        <strong>Brand:</strong> {product.brand}
                                    </Card.Text>
                                    <Card.Text className="text-success mb-2">
                                        <strong>Stock:</strong> {product.stock}
                                    </Card.Text>
                                    <Card.Text className="text-dark">
                                        <strong>Price:</strong> ₱{product.price.toLocaleString()}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Button
                                            variant="dark"
                                            className="w-75 rounded-pill me-3"
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            variant="outline-dark"
                                            className="w-25 rounded-pill"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <FaShoppingCart />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default ClientProductPage;
