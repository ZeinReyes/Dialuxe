import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import crypto from 'crypto';

const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: '"Dialuxe" <your-email@gmail.com>',
        to: email,
        subject: 'Verify your Email for Dialuxe',
        html: `
            <h2>Welcome to Dialuxe!</h2>
            <p>Please click on the link below to verify your email address:</p>
            <a href="http://localhost:3000/verify-email?token=${verificationToken}">Verify your Email</a>
            <p>This link will expire in 1 hour.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Request body:', req.body);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const verificationToken = crypto.randomBytes(32).toString('hex');
        newUser.emailVerificationToken = verificationToken;
        newUser.emailVerificationTokenExpiry = Date.now() + 3600000;

        await newUser.save();

        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'Registration successful. Please verify your email.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpiry = undefined;

        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

const otps = new Map();

const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: '"Dialuxe Support" <your-email@gmail.com>',
        to: email,
        subject: '🔐 Dialuxe OTP Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                <h2 style="color: #c5a100;">Dialuxe Verification</h2>
                <p>Hi there,</p>
                <p>You recently attempted to log in to your Dialuxe account. Please use the following One-Time Password (OTP) to complete your login:</p>
                <h1 style="letter-spacing: 4px; color: #333;">${otp}</h1>
                <p>This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                <p>If you did not request this, please ignore this email or contact support immediately.</p>
                <br />
                <p style="font-size: 14px; color: #888;">— The Dialuxe Team</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        if (!user.isEmailVerified) {
            return res.status(403).json({ error: 'Please verify your email before logging in.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otps.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

        await sendOtpEmail(email, otp);

        return res.status(200).json({ message: 'OTP sent to email', requireOTP: true, email });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const record = otps.get(email);

    if (!record) return res.status(400).json({ message: 'No OTP found. Please log in again.' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
    if (Date.now() > record.expires) {
        otps.delete(email);
        return res.status(400).json({ message: 'OTP expired. Please login again.' });
    }

    otps.delete(email);

    const user = await User.findOne({ email });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    let redirectUrl = user.role === 'admin' ? '/admin' : '/client';

    res.status(200).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        redirectUrl,
    });
};