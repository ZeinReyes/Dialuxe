import User from '../models/User.js';

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password, role });

    try {
        const createdUser = await newUser.save();
        res.status(201).json(createdUser);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err.message });
    }
};

export const getUser = async (req, res) => {
    const users = await User.find();
    res.json(users);
}

export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        Object.assign(user, req.body);
        const updated = await user.save();
        res.json(updated);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

