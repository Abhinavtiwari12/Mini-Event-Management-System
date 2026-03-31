import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mini_events_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const initializeDB = async () => {
    // Temporary connection without database specified to create it if it doesn't exist
    const initialConn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    try {
        await initialConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'mini_events_db'}\`;`);
        console.log("Database ensured.");
        
        // Dropping old tables to recreate with new schema since auth was added
        await pool.query('DROP TABLE IF EXISTS EventAttendance;');
        await pool.query('DROP TABLE IF EXISTS Bookings;');
        await pool.query('DROP TABLE IF EXISTS Events;');
        await pool.query('DROP TABLE IF EXISTS Users;');

        // Execute DDL with pool
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user'
            );
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                date DATETIME NOT NULL,
                total_capacity INT NOT NULL,
                remaining_tickets INT NOT NULL
            );
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_id INT NOT NULL,
                booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
            );
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS EventAttendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_id INT NOT NULL,
                entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
            );
        `);
        console.log("Tables synchronized with new schema.");
    } catch (error) {
        console.error("Error initializing Database:", error);
    } finally {
        await initialConn.end();
    }
};
