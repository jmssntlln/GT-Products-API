import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  
  async registerUser(userData) {
    const { username, email, password } = userData;
    try {
    
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
      `;
      const [result] = await pool.execute(query, [username, email, hashedPassword]);
      
      return await this.getUserById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ApiError(409, 'Username or email already exists');
      }
      throw error;
    }
  }

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
    
    const query = `SELECT id, username, email, createdAt FROM users WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    if (rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }
    return rows[0];
  }

  async getAllUsers() {
    
    const query = `SELECT id, username, email, createdAt FROM users ORDER BY createdAt DESC`;
    const [rows] = await pool.execute(query);
    return rows;
  }

  
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

export const loginUser = async (loginData) => {
    const { email, password } = loginData;

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
        throw new ApiError(401, "Invalid credentials"); 
    }
    const user = rows[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid credentials"); 
    }

    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h' 
    });

    return token;
};

const userService = new UserService();
export { userService };