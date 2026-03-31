🚀 Mini Event Management System (Backend)

A scalable and secure Event Management Backend System built using Node.js, Express.js, and MySQL, supporting user authentication, event booking, and real-time attendance tracking with role-based access control.

📌 Features
🔐 Authentication & Authorization
JWT-based authentication (User & Admin)
Role-based access control (RBAC)
Secure password hashing using bcrypt

👤 User Functionalities
User Registration & Login
View Profile
Browse Events
Book Event Tickets
Record Attendance (only if booked)

🛠️ Admin Functionalities
Admin Registration & Login
Create Events
Update Events (with dynamic ticket adjustment)
Secure admin-only routes

🎟️ Booking System
Transaction-based booking (ACID compliant)
Prevents overbooking using row-level locking
Real-time ticket availability updates

📊 Attendance System
Only booked users can mark attendance
Prevents duplicate attendance entries

🏗️ Tech Stack
Backend: Node.js, Express.js
Database: MySQL
Authentication: JWT
Security: bcrypt
API Docs: Swagger (OpenAPI)

📂 Project Structure
project/
│── config/
│   └── db.js
│── controllers/
│   ├── admin.controller.js
│   ├── user.controller.js
│   ├── event.controller.js
│   ├── booking.controller.js
│   └── attendance.controller.js
│── middleware/
│   └── auth.middleware.js
│── routes/
│   └── router.js
│── app.js
│── openapi.yaml
│── .env

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone <your-repo-url>
cd project

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=mini_events_db
JWT_SECRET=your_secret_key
PORT=5000

4️⃣ Run Server
node app.js
🌐 API Base URL
http://localhost:5000/api
📖 API Documentation

Swagger UI available at:

http://localhost:5000/api-docs
🔗 API Endpoints

👤 User Routes
Method	Endpoint	Description
POST	/users/register	Register user
POST	/users/login	Login user
GET	/users/profile	Get profile
POST	/users/logout	Logout

🛠️ Admin Routes
Method	Endpoint	Description
POST	/admin/register	Register admin
POST	/admin/login	Login admin
POST	/admin/logout	Logout admin
POST	/admin/events	Create event
PUT	/admin/events/:id	Update event

🎉 Event Routes
Method	Endpoint	Description
GET	/events	Get all events

🎟️ Booking Routes
Method	Endpoint	Description
POST	/bookings	Book ticket

✅ Attendance Routes
Method	Endpoint	Description
POST	/attendance	Mark attendance

🧠 Key Implementations
🔒 Secure Authentication
JWT tokens with expiry
Role-based middleware (verifyToken, verifyAdmin)

⚡ Transaction Handling
START TRANSACTION → COMMIT / ROLLBACK
Prevents race conditions during booking
Ensures data consistency

🎯 Capacity Management
Dynamic adjustment of remaining_tickets
Prevents overbooking

🛡️ Data Integrity
Foreign key constraints
Cascading deletes
Duplicate prevention (email, attendance)

💡 Sample API Request
Create Event
POST /api/admin/events

{
  "title": "Music Fest",
  "description": "Live concert",
  "date": "2026-04-10 18:00:00",
  "total_capacity": 100
}

📈 Future Improvements
Payment Integration (Stripe/Razorpay)
Email Notifications
Event Categories & Filters
Admin Dashboard Analytics
Rate Limiting & Security Enhancements

👨‍💻 Author
Abhinav Tiwari
