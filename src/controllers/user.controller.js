import { userService } from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from 'express-async-handler';

export const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    
    res.status(201).json(
        new ApiResponse(201, user, 'User created successfully')
    );
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    
    res.status(200).json(
        new ApiResponse(200, user, 'User retrieved successfully')
    );
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    
    res.status(200).json(
        new ApiResponse(200, users, 'Users retrieved successfully')
    );
});

// Challenge 1: Get posts by a specific user
export const getPostsByUser = asyncHandler(async (req, res) => {
    const posts = await userService.getPostsByAuthorId(req.params.userId);
    
    res.status(200).json(
        new ApiResponse(200, posts, 'User posts retrieved successfully')
    );
});