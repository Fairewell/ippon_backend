const { pool } = require('../config/database');

class Service {
  static async create({ name, description, price_per_day }) {
    const query = `
      INSERT INTO services (name, description, price_per_day)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [name, description, price_per_day];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM services';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM services WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, { name, description, price_per_day }) {
    const query = `
      UPDATE services
      SET name = $1, description = $2, price_per_day = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const values = [name, description, price_per_day, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM services WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Service;