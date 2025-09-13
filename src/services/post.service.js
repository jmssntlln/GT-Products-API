import { ApiError } from '../utils/ApiError.js';
import { pool } from '../config/db.js';


export const getAllPosts = async () => {
    const [rows] = await pool.query('SELECT * FROM posts');
    return rows;
};


export const getPostById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (!rows[0]) {
        throw new ApiError(404, "Post not found");
    }
    return rows[0];
};


export const createPost = async (postData) => {
    const { title, content } = postData;
    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const [result] = await pool.query(
        'INSERT INTO posts (title, content) VALUES (?, ?)',
        [title, content]
    );

    return { id: result.insertId, title, content };
};


export const updatePost = async (id, postData) => {
    const { title, content } = postData;
    const [result] = await pool.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
    );

    if (result.affectedRows === 0) {
        throw new ApiError(404, "Post not found");
    }

    return getPostById(id);
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


export const deletePost = async (id) => {
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
        throw new ApiError(404, "Post not found");
    }

    return true;
};
