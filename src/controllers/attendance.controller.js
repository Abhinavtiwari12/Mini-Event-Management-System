import { pool } from '../config/db.js';

export const recordAttendance = async (req, res) => {
    const user_id = req.user.id; // From authMiddleware
    const { event_id } = req.body;

    if (!event_id) {
        return res.status(400).json({ error: 'event_id is required' });
    }

    try {
        // Check if user has a booking
        const [bookings] = await pool.query(
            'SELECT * FROM Bookings WHERE user_id = ? AND event_id = ?',
            [user_id, event_id]
        );

        if (bookings.length === 0) {
            return res.status(400).json({ error: 'No booking found for user in this event' });
        }

        // Check if attendance already recorded (optional, but good practice)
        const [attendance] = await pool.query(
            'SELECT * FROM EventAttendance WHERE user_id = ? AND event_id = ?',
            [user_id, event_id]
        );

        if (attendance.length > 0) {
            return res.status(400).json({ error: 'Attendance already recorded for this user' });
        }

        // Record attendance
        await pool.query(
            'INSERT INTO EventAttendance (user_id, event_id) VALUES (?, ?)',
            [user_id, event_id]
        );

        res.status(201).json({ message: 'Attendance recorded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
