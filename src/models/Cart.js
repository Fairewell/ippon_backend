const { pool } = require('../config/database');

class Cart {
  static async findByUserId(userId) {
    const query = `
      SELECT c.id as cart_id, ci.*, s.name, s.price_per_day
      FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      JOIN services s ON ci.service_id = s.id
      WHERE c.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async addItem(userId, { serviceId, startDate, endDate }) {
    // Находим или создаем корзину пользователя
    let cart = await this.findByUserId(userId);
    if (!cart || cart.length === 0) {
      const createCartQuery = 'INSERT INTO carts (user_id) VALUES ($1) RETURNING id';
      const { rows } = await pool.query(createCartQuery, [userId]);
      cart = rows[0];
    }

    const cartId = cart[0]?.cart_id || cart.id;

    // Добавляем элемент в корзину
    const query = `
      INSERT INTO cart_items (cart_id, service_id, start_date, end_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [cartId, serviceId, startDate, endDate];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async removeItem(cartItemId) {
    const query = 'DELETE FROM cart_items WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [cartItemId]);
    return rows[0];
  }

  static async clear(userId) {
    const cart = await this.findByUserId(userId);
    if (cart.length === 0) return;

    const cartId = cart[0].cart_id;
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    await pool.query('DELETE FROM carts WHERE id = $1', [cartId]);
  }
}

module.exports = Cart;