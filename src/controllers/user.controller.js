import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Shared login logic for reuse
export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'supersecret',
        { expiresIn: '24h' }
    );
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'user']
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const [users] = await pool.query('SELECT * FROM Users WHERE email = ? AND role = "user"', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role FROM Users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        
        res.status(200).json(users[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const logoutUser = (req, res) => {
    // JWT is stateless, so we just tell client to discard token
    res.status(200).json({ message: 'Logged out successfully. Please discard your token.' });
};
