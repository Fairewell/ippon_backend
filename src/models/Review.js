const { pool } = require('../config/database');

class Review {
  static async create({ userId, serviceId, rating, comment }) {
    const query = `
      INSERT INTO reviews (user_id, service_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [userId, serviceId, rating, comment];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM reviews';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findByService(serviceId) {
    const query = 'SELECT * FROM reviews WHERE service_id = $1';
    const { rows } = await pool.query(query, [serviceId]);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM reviews WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, { rating, comment }) {
    const query = `
      UPDATE reviews
      SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const values = [rating, comment, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM reviews WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Review;