import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

class UserService {
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
        const query = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await pool.execute(query, [id]);
        
        if (rows.length === 0) {
            throw new ApiError(404, 'User not found');
        }
        
        return rows[0];
    }

    async getAllUsers() {
        const query = `SELECT * FROM users ORDER BY createdAt DESC`;
        const [rows] = await pool.execute(query);
        return rows;
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