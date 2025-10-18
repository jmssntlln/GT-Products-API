import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';

class UserService {
  // Registration method with password hashing
  async registerUser(userData) {
    const { username, email, password } = userData;
    try {
      // HASH THE PASSWORD
      const saltRounds = 10; // The cost factor for hashing
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
      `;
      const [result] = await pool.execute(query, [username, email, hashedPassword]);
      
      // Return user without password
      return await this.getUserById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ApiError(409, 'Username or email already exists');
      }
      throw error;
    }
  }

  // Legacy method - kept for backward compatibility (if needed)
  // Consider removing this if all registration goes through registerUser
  async createUser(userData) {
    const { username, email } = userData;
    try {
      const query = `
        INSERT INTO users (username, email)
        VALUES (?, ?)
      `;
      const [result] = await pool.execute(query, [username, email]);
      return await this.getUserById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ApiError(409, 'Username or email already exists');
      }
      throw error;
    }
  }

  async getUserById(id) {
    // IMPORTANT: Exclude the password hash when fetching user data
    const query = `SELECT id, username, email, createdAt FROM users WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    if (rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }
    return rows[0];
  }

  async getAllUsers() {
    // IMPORTANT: Exclude the password hash here too
    const query = `SELECT id, username, email, createdAt FROM users ORDER BY createdAt DESC`;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Helper method to get user WITH password (for authentication)
  async getUserByEmailWithPassword(email) {
    const query = `SELECT id, username, email, password, createdAt FROM users WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  async getPostsByAuthorId(userId) {
    await this.getUserById(userId);
    const query = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.authorId,
        p.createdAt,
        p.updatedAt,
        u.username AS authorUsername,
        u.email AS authorEmail
      FROM posts p
      JOIN users u ON p.authorId = u.id
      WHERE p.authorId = ?
      ORDER BY p.createdAt DESC
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }
}

const userService = new UserService();
export { userService };