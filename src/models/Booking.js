const { pool } = require('../config/database');

class Booking {
  static async create({ userId, serviceId, startDate, endDate, totalPrice, status = 'pending', name, email, phone }) {
    const query = `
      INSERT INTO bookings (user_id, service_id, start_date, end_date, total_price, status, guest_name, guest_email, guest_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [userId, serviceId, startDate, endDate, totalPrice, status, name, email, phone];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT b.*, s.name as service_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM bookings WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
  }

  static async checkAvailability(serviceId, startDate, endDate) {
    const query = `
      SELECT COUNT(*) 
      FROM bookings 
      WHERE service_id = $1 
        AND status != 'cancelled'
        AND (start_date, end_date) OVERLAPS ($2::DATE, $3::DATE)
    `;
    const { rows } = await pool.query(query, [serviceId, startDate, endDate]);
    return rows[0].count === '0';
  }
}

module.exports = Booking;