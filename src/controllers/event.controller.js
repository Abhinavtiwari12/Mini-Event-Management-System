import { pool } from '../config/db.js';

export const getEvents = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Events ORDER BY date asc');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
