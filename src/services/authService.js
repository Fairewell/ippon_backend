const UserRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(userData) {
    // Валидация будет вынесена в отдельный слой
    return this.userRepository.create(userData);
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await this.userRepository.comparePasswords(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  async getCurrentUser(userId) {
    return this.userRepository.findById(userId);
  }
}

module.exports = AuthService;