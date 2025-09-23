import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

class CommentService {
    async createComment(commentData) {
        const { text, postId, authorId } = commentData;
        
        try {
            const query = `
                INSERT INTO comments (text, postId, authorId) 
                VALUES (?, ?, ?)
            `;
            
            const [result] = await pool.execute(query, [text, postId, authorId]);
            
            // Fetch and return the newly created comment with author info
            return await this.getCommentById(result.insertId);
        } catch (error) {
            // Handle foreign key constraint errors
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new ApiError(400, 'Invalid post ID or author ID. Post or user does not exist');
            }
            throw error;
        }
    }

    async getCommentById(id) {
        const query = `
            SELECT 
                c.id,
                c.text,
                c.postId,
                c.authorId,
                c.createdAt,
                c.updatedAt,
                u.username AS authorUsername,
                u.email AS authorEmail,
                p.title AS postTitle
            FROM comments c
            JOIN users u ON c.authorId = u.id
            JOIN posts p ON c.postId = p.id
            WHERE c.id = ?
        `;
        
        const [rows] = await pool.execute(query, [id]);
        
        if (rows.length === 0) {
            throw new ApiError(404, 'Comment not found');
        }
        
        return rows[0];
    }

    async getAllComments() {
        const query = `
            SELECT 
                c.id,
                c.text,
                c.postId,
                c.authorId,
                c.createdAt,
                c.updatedAt,
                u.username AS authorUsername,
                u.email AS authorEmail,
                p.title AS postTitle
            FROM comments c
            JOIN users u ON c.authorId = u.id
            JOIN posts p ON c.postId = p.id
            ORDER BY c.createdAt DESC
        `;
        
        const [rows] = await pool.execute(query);
        return rows;
    }

    async getCommentsByPostId(postId) {
        const query = `
            SELECT 
                c.id,
                c.text,
                c.postId,
                c.authorId,
                c.createdAt,
                c.updatedAt,
                u.username AS authorUsername,
                u.email AS authorEmail
            FROM comments c
            JOIN users u ON c.authorId = u.id
            WHERE c.postId = ? 
            ORDER BY c.createdAt DESC
        `;
        
        const [rows] = await pool.execute(query, [postId]);
        return rows;
    }

    async updateComment(id, commentData) {
        // First check if comment exists
        await this.getCommentById(id);
        
        const { text } = commentData;
        
        const query = `
            UPDATE comments 
            SET text = ?, updatedAt = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        
        await pool.execute(query, [text, id]);
        
        // Return the updated comment
        return await this.getCommentById(id);
    }

    async deleteComment(id) {
        // First check if comment exists
        await this.getCommentById(id);
        
        const query = `DELETE FROM comments WHERE id = ?`;
        await pool.execute(query, [id]);
        
        return { message: 'Comment deleted successfully' };
    }
}

const commentService = new CommentService();
export { commentService };