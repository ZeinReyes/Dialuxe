import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
    const { user, login, logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [isEditing, setIsEditing] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email, password: '', confirmPassword: '' });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match");
        }

        try {
            const res = await axios.put('/api/users/update-profile', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Profile updated successfully');
            login(res.data.updatedUser);
            setIsEditing(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEdit = () => {
        setIsEditing(true); 
    };

    return (
        <Container className="mt-2 pt-5">
            <Link to="/home" className="text-decoration-none mb-3 d-inline-block text-primary">
                &larr; Back
            </Link>
            <Row className="g-0 rounded overflow-hidden border shadow-lg">
                <Col md={4} style={{ backgroundColor: '#001F3F' }} className="text-white p-4 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex align-items-center mb-4 border-bottom py-3">
                            <div
                                className="bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center"
                                style={{ width: 60, height: 60, fontSize: 24 }}
                            >
                                {user?.name?.charAt(0).toUpperCase() || 'P'}
                            </div>
                            <div className="ms-3">
                                <h5 className="mb-0">{user?.name || 'User'}</h5>
                                <small>{user?.email || 'user@example.com'}</small>
                            </div>
                        </div>

                        <Nav className="flex-column mt-4">
                            <Nav.Link as={Link} to="/profile" className="text-warning fw-semibold active">
                                Account Information
                            </Nav.Link>
                            <Nav.Link as={Link} to="/orders" className="text-white fw-semibold">
                                My Orders
                            </Nav.Link>
                        </Nav>
                    </div>

                    <div className="p-3">
                        <a onClick={handleLogout} className="btn btn-outline-danger w-100" href="#">
                            <i className="bi bi-box-arrow-right me-2"></i> Logout
                        </a>
                    </div>
                </Col>

                <Col md={8} className="bg-white p-5">
                    <h4 className="mb-4 fw-bold">Account Information</h4>

                    <Form onSubmit={handleProfileUpdate}>
                        <Form.Group as={Row} className="mb-4 align-items-center border-top border-bottom w-100 py-3" controlId="formName">
                            <Form.Label column sm={3} className="fw-semibold">
                                Full Name
                            </Form.Label>
                            <Col sm={9}>
                                {isEditing ? (
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                ) : (
                                    <div>{formData.name}</div>
                                )}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4 align-items-center border-top border-bottom w-100 py-3" controlId="formEmail">
                            <Form.Label column sm={3} className="fw-semibold">
                                Email
                            </Form.Label>
                            <Col sm={9}>
                                {isEditing ? (
                                    <Form.Control
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                ) : (
                                    <div>{formData.email}</div>
                                )}
                            </Col>
                        </Form.Group>

                        {isEditing && (
                            <>
                                <Form.Group as={Row} className="mb-4 align-items-center border-top border-bottom w-100 py-3" controlId="formPassword">
                                    <Form.Label column sm={3} className="fw-semibold">
                                        New Password
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Leave blank to keep current"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-4 align-items-center border-top border-bottom w-100 py-3" controlId="formConfirmPassword">
                                    <Form.Label column sm={3} className="fw-semibold">
                                        Confirm Password
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="Repeat new password"
                                        />
                                    </Col>
                                </Form.Group>
                            </>
                        )}

                        {isEditing && (
                            <div className="text-start">
                                <Button className="px-5" variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </Form>
                    {!isEditing && (
                        <div className="text-start mb-3">
                            <Button className="px-5" variant="primary" onClick={handleEdit}>
                                Edit
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
