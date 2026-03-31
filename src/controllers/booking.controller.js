import { pool } from '../config/db.js';

export const bookTicket = async (req, res) => {
    const user_id = req.user.id; // From authMiddleware
    const { event_id } = req.body;

    if (!event_id) {
        return res.status(400).json({ error: 'event_id is required' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Check if user exists (should exist due to token, but just to be safe)
        const [users] = await connection.query('SELECT id FROM Users WHERE id = ?', [user_id]);
        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'User not found' });
        }

        // Check event and remaining tickets with locking for update
        const [events] = await connection.query('SELECT remaining_tickets FROM Events WHERE id = ? FOR UPDATE', [event_id]);
        if (events.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Event not found' });
        }

        if (events[0].remaining_tickets <= 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Event is fully booked' });
        }

        // Create Booking
        await connection.query('INSERT INTO Bookings (user_id, event_id) VALUES (?, ?)', [user_id, event_id]);

        // Decrement available tickets
        await connection.query('UPDATE Events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?', [event_id]);

        await connection.commit();
        res.status(201).json({ message: 'Ticket booked successfully' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};
