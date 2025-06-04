const bcrypt = require('bcryptjs');

class UserRepository {
  constructor(database) {
    this.database = database;
  }

  async create({ username, email, password, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at
    `;
    const values = [username, email, hashedPassword, role];
    const { rows } = await this.database.query(query, values);
    return rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await this.database.query(query, [email]);
    return rows[0];
  }

  async findById(id) {
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = $1';
    const { rows } = await this.database.query(query, [id]);
    return rows[0];
  }

  async comparePasswords(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = UserRepository;