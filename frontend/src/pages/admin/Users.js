import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'client',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (error) {
            setError('Failed to fetch users. Please try again later.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const dataToSubmit = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
            };

            await axios.put(`http://localhost:5000/api/users/${editId}`, dataToSubmit);

            setShowModal(false);
            setFormData({ name: '', email: '', role: 'client' });
            setIsEditing(false);
            setEditId(null);
            fetchUsers();
        } catch (error) {
            setError('Failed to update user. Please try again later.');
        }
    };

    const handleEdit = (user) => {
        setFormData({ name: user.name, email: user.email, role: user.role });
        setIsEditing(true);
        setEditId(user._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                fetchUsers();
            } catch (error) {
                setError('Failed to delete user. Please try again later.');
            }
        }
    };

    return (
        <div className="container">
            <h3 className="mb-4">Manage Users</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th style={{ width: '200px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No users found</td>
                        </tr>
                    ) : (
                        users.map((user, idx) => (
                            <tr key={user._id}>
                                <td>{idx + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <Button className='me-2' size="sm" variant="warning" onClick={() => handleEdit(user)}>
                                        <i className="bi bi-pencil me-2"></i>Edit
                                    </Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(user._id)}>
                                        <i className="bi bi-trash me-2"></i>Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" value={formData.name} onChange={handleChange} disabled required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} disabled required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Role</Form.Label>
                            <Form.Select name="role" value={formData.role} onChange={handleChange}>
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Update User
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Users;
