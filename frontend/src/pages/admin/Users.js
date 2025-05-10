import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../../context/AuthContext';

const Users = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
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
        } catch {
            setError('Failed to fetch users.');
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/logs/all');
            setLogs(res.data);
        } catch {
            setError('Failed to fetch logs.');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchLogs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/users/${editId}`, {
                ...formData,
                adminEmail: user.email 
            });

            setShowModal(false);
            setFormData({ name: '', email: '', role: 'client' });
            setIsEditing(false);
            setEditId(null);
            fetchUsers();
            fetchLogs();
        } catch {
            setError('Failed to update user.');
        }
    };

    const handleEdit = (user) => {
        setFormData({ name: user.name, email: user.email, role: user.role });
        setIsEditing(true);
        setEditId(user._id);
        setShowModal(true);
    };

    const handleDelete = async (id, email) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    data: { adminEmail: user.email }  
                });
                fetchUsers();
                fetchLogs();
            } catch {
                setError('Failed to delete user.');
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
                    {users.map((user, idx) => (
                        <tr key={user._id}>
                            <td>{idx + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button className="me-2" size="sm" variant="warning" onClick={() => handleEdit(user)}>
                                    <i className="bi bi-pencil me-2"></i>Edit
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(user._id, user.email)}>
                                    <i className="bi bi-trash me-2"></i>Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4 className="mt-5">Activity Logs</h4>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Action</th>
                        <th>Performed By</th>
                        <th>Target User</th>
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
                            <td>{log.targetUser}</td>
                            <td>{log.details}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
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
                            <Form.Control name="name" value={formData.name} disabled />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} disabled />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Role</Form.Label>
                            <Form.Select name="role" value={formData.role} onChange={handleChange}>
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                                <option value="rider">Rider</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>Update User</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Users;
