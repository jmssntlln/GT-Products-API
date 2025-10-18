// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import { userService } from '../services/user.service.js'; // Import the userService instance

export const authenticate = asyncHandler(async (req, res, next) => {
  // Extract token from Authorization header
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Get the token after "Bearer "
  }

  // Check if token exists
  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token payload (without password)
    req.user = await userService.getUserById(decoded.id);
    
    // Proceed to next middleware/controller
    next();
  } catch (error) {
    // Handle JWT specific errors
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired');
    }
    // Re-throw other errors
    throw new ApiError(401, 'Invalid or expired token');
  }
});