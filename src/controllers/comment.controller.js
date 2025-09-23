import { commentService } from '../services/comment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from 'express-async-handler';

export const createComment = asyncHandler(async (req, res) => {
    const comment = await commentService.createComment(req.body);
    
    res.status(201).json(
        new ApiResponse(201, comment, 'Comment created successfully')
    );
});

export const getCommentById = asyncHandler(async (req, res) => {
    const comment = await commentService.getCommentById(req.params.id);
    
    res.status(200).json(
        new ApiResponse(200, comment, 'Comment retrieved successfully')
    );
});

export const getAllComments = asyncHandler(async (req, res) => {
    const comments = await commentService.getAllComments();
    
    res.status(200).json(
        new ApiResponse(200, comments, 'Comments retrieved successfully')
    );
});

export const getCommentsByPost = asyncHandler(async (req, res) => {
    const comments = await commentService.getCommentsByPostId(req.params.postId);
    
    res.status(200).json(
        new ApiResponse(200, comments, 'Post comments retrieved successfully')
    );
});

export const updateComment = asyncHandler(async (req, res) => {
    const comment = await commentService.updateComment(req.params.id, req.body);
    
    res.status(200).json(
        new ApiResponse(200, comment, 'Comment updated successfully')
    );
});

export const deleteComment = asyncHandler(async (req, res) => {
    const result = await commentService.deleteComment(req.params.id);
    
    res.status(200).json(
        new ApiResponse(200, result, 'Comment deleted successfully')
    );
});