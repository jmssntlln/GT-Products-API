import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();


router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:userId/posts', userController.getPostsByUser);
router.get('/:id', userController.getUserById);

export default router;