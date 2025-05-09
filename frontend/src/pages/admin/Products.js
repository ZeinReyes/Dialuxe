import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../../context/AuthContext';

const AdminProductPage = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        price: '',
        stock: '',
        image: '', 
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (error) {
            setError('Failed to fetch products. Please try again later.');
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products/logs/all');
            setLogs(res.data);
        } catch {
            setError('Failed to fetch logs.');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchLogs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'image' && value && !value.startsWith('/')) {
            setFormData({ ...formData, [name]: `/assets/images/products/${value}` });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        try {
            const updatedFormData = {
                ...formData,
                price: parseFloat(formData.price), 
                stock: parseInt(formData.stock, 10), 
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/products/${editId}`, {
                    ...updatedFormData,  
                    adminEmail: user.email, 
                });
            } else {
                await axios.post('http://localhost:5000/api/products', {
                    ...updatedFormData,
                    adminEmail: user.email
                });
            }

            setShowModal(false);
            setFormData({ name: '', description: '', brand: '', price: '', stock: '', image: '' });
            setIsEditing(false);
            setEditId(null);
            fetchProducts();  
            fetchLogs();     
        } catch (error) {
            setError('Failed to submit product. Please try again later.');
        }
    };

    const handleEdit = (product) => {
        setFormData(product);
        setIsEditing(true);
        setEditId(product._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`, {
                    data: { adminEmail: user.email }  
                });
                fetchProducts();
                fetchLogs();
            } catch (error) {
                setError('Failed to delete product. Please try again later.');
            }
        }
    };

    return (
        <div className="container">
            <Row className="mb-4 align-items-center">
                <Col><h3>Manage Products</h3></Col>
                <Col className="text-end">
                    <Button onClick={() => setShowModal(true)} variant="primary">
                        <i className="bi bi-plus-circle me-2"></i>Add Product
                    </Button>
                </Col>
            </Row>

            {error && <div className="alert alert-danger">{error}</div>}

            <Row className="mb-3">
                <Col md={4}><Form.Control placeholder="Search by name or brand" /></Col>
                <Col md={3}>
                    <Form.Select>
                        <option value="">Filter by Brand</option>
                        <option>Rolex</option>
                        <option>Patek Philippe</option>
                        <option>Audemars Piguet</option>
                        <option>Cartier</option>
                    </Form.Select>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Image</th>
                        <th style={{ width: '210px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">No products yet</td>
                        </tr>
                    ) : (
                        products.map((product, idx) => (
                            <tr key={product._id}>
                                <td>{idx + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td>₱{Number(product.price).toLocaleString()}</td>
                                <td>{product.stock}</td>
                                <td>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>
                                    <Button className='me-3' size="sm" variant="warning" onClick={() => handleEdit(product)}>
                                        <i className="bi bi-pencil ms-1 me-3"></i>Edit
                                    </Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(product._id)}>
                                        <i className="bi bi-trash ms-1 me-3"></i>Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <h4 className="mt-5">Activity Logs</h4>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Action</th>
                        <th>Performed By</th>
                        <th>Target Product</th> 
                        <th>Details</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, idx) => (
                        <tr key={log._id}>
                            <td>{idx + 1}</td>
                            <td>{log.action}</td>
                            <td>{log.performedBy}</td>
                            <td>{log.targetProduct}</td>
                            <td>{log.details}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Product' : 'Add Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control name="description" value={formData.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Brand</Form.Label>
                            <Form.Select name="brand" value={formData.brand} onChange={handleChange} required>
                                <option value="">Choose brand</option>
                                <option>Rolex</option>
                                <option>Patek Philippe</option>
                                <option>Audemars Piguet</option>
                                <option>Cartier</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Enter the image URL" />
                            {formData.image && (
                                <div className="mt-3">
                                    <h6>Image Preview:</h6>
                                    <img src={formData.image} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'} Product</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminProductPage;