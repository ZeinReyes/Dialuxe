import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Request body:', req.body);
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error); // Log the full error
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token with user id and role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Determine the redirect URL based on the user's role
        let redirectUrl = '';
        if (user.role === 'admin') {
            redirectUrl = '/admin';
        } else if (user.role === 'client') {
            redirectUrl = '/client';
        }

        // Send response with user data, token, and the redirect URL
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            redirectUrl, // Ensure the redirect URL is sent in the response
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};