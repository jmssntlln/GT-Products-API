import { ApiError } from '../utils/ApiError.js';
import { pool } from '../config/db.js';

export const getAllPosts = async () => {
   
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
        ORDER BY p.createdAt DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
};

export const getPostById = async (id) => {
    
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
        WHERE p.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    if (!rows[0]) {
        throw new ApiError(404, "Post not found");
    }
    return rows[0];
};

export const createPost = async (postData, authorId) => {
    const { title, content } = postData;
    try {
        const [result] = await pool.query(
            'INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)',
            [title, content, authorId] 
        );
        const newPost = await getPostById(result.insertId);
        return newPost;
    } catch (error) {
       
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new ApiError(400, 'Invalid author ID. User does not exist');
        }
        throw error;
    }
};

export const partiallyUpdatePost = async (id, updates) => {
    const fields = [];
    const values = [];
    
    for (const key in updates) {
        if (['title', 'content'].includes(key)) {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        }
    }
    
    if (fields.length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }
    
  
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);
    
    const [result] = await pool.query(
        `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`,
        values
    );
    
    if (result.affectedRows === 0) {
        throw new ApiError(404, "Post not found");
    }
    
    return getPostById(id);
};

export const updatePost = async (id, postData, userId) => { 
    const { title, content } = postData;

    const post = await getPostById(id); 

    if (post.authorId !== userId) {
        throw new ApiError(403, "Forbidden: You do not have permission to edit this post.");
    }

    await pool.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
    );
    const updatedPost = await getPostById(id);
    return updatedPost;
};

export const deletePost = async (id, userId) => { 
    
    const post = await getPostById(id);

    if (post.authorId !== userId) {
        throw new ApiError(403, "Forbidden: You do not have permission to delete this post.");
    }

    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows;
};