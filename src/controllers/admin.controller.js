import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from './user.controller.js';

export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'admin']
        );
        res.status(201).json({ message: 'Admin registered successfully', adminId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
};

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const [users] = await pool.query('SELECT * FROM Users WHERE email = ? AND role = "admin"', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid admin credentials' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid admin credentials' });

        const token = generateToken(user);
        res.status(200).json({ message: 'Admin Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const logoutAdmin = (req, res) => {
    res.status(200).json({ message: 'Admin Logged out successfully. Please discard your token.' });
};

// Event Management under Admin functionality
export const createEvent = async (req, res) => {
    const { title, description, date, total_capacity } = req.body;

    if (!title || !date || !total_capacity) {
        return res.status(400).json({ error: 'Title, date, and total_capacity are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO Events (title, description, date, total_capacity, remaining_tickets) VALUES (?, ?, ?, ?, ?)',
            [title, description || null, date, total_capacity, total_capacity]
        );
        res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, total_capacity } = req.body;

    try {
        const [events] = await pool.query('SELECT * FROM Events WHERE id = ?', [id]);
        if (events.length === 0) return res.status(404).json({ error: 'Event not found' });
        
        let query = 'UPDATE Events SET ';
        let fields = [];
        let values = [];

        if (title) { fields.push('title = ?'); values.push(title); }
        if (description) { fields.push('description = ?'); values.push(description); }
        if (date) { fields.push('date = ?'); values.push(date); }
        
        // Capacity logic: adjust remaining_tickets based on total_capacity delta
        if (total_capacity) {
            const currentCapacity = events[0].total_capacity;
            const diff = total_capacity - currentCapacity;
            fields.push('total_capacity = ?'); values.push(total_capacity);
            fields.push('remaining_tickets = remaining_tickets + ?'); values.push(diff);
        }

        if (fields.length === 0) return res.status(400).json({ error: 'No valid fields provided for update' });

        query += fields.join(', ') + ' WHERE id = ?';
        values.push(id);

        await pool.query(query, values);
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
