import { body, validationResult } from 'express-validator';

export const validatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required.'),
  body('authorId')
    .isInt({ min: 1 })
    .withMessage('A valid author ID is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    next();
  },
];

export const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required.'),
  body('authorId')
    .isInt({ min: 1 })
    .withMessage('A valid author ID is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    next();
  },
];

export const validateUser = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    next();
  },
];