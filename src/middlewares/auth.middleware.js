import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import { userService } from '../services/user.service.js'; 

export const authenticate = asyncHandler(async (req, res, next) => {
  
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; 
  }

  
  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userService.getUserById(decoded.id);
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired');
    }
    throw new ApiError(401, 'Invalid or expired token');
  }
});