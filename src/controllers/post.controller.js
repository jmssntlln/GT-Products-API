// src/controllers/post.controller.js
import * as postService from '../services/post.service.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts', error: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postService.getPostById(parseInt(id));
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving post', error: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        
        const newPost = await postService.createPost({ title, content });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        
        const updatedPost = await postService.updatePost(parseInt(id), { title, content });
        
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
};

export const patchPost = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'At least one field is required for update' });
        }
        
        const updatedPost = await postService.partiallyUpdatePost(parseInt(id), updates);
        
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await postService.deletePost(parseInt(id));
        
        if (!deleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};