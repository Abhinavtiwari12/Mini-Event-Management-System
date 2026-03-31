import express from 'express';


import { registerAdmin, 
    loginAdmin, 
    logoutAdmin, 
    createEvent, 
    updateEvent 
} from '../controllers/admin.controller.js';

import { registerUser, 
    loginUser, 
    getProfile, 
    logoutUser 
} from '../controllers/user.controller.js';

import { getEvents } from '../controllers/event.controller.js';

import { bookTicket } from '../controllers/booking.controller.js';

import { recordAttendance } from '../controllers/attendance.controller.js';

import { verifyToken, verifyAdmin } from '../middleware/autho.middleware.js';

const router = express.Router();


// --- Admin Routes ---
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.post('/admin/logout', verifyToken, verifyAdmin, logoutAdmin);
router.post('/admin/events', verifyToken, verifyAdmin, createEvent);
router.put('/admin/events/:id', verifyToken, verifyAdmin, updateEvent);



// --- Auth / User Routes ---
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/profile', verifyToken, getProfile);
router.post('/users/logout', verifyToken, logoutUser);


// --- Public Event Routes ---
router.get('/events', getEvents);

// --- Booking Routes ---
router.post('/bookings', verifyToken, bookTicket);

// --- Attendance Routes ---
router.post('/attendance', verifyToken, recordAttendance);

export default router;
