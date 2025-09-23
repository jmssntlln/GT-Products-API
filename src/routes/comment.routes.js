import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { validateComment } from '../middlewares/validator.middleware.js';

const router = Router();

router.post('/', validateComment, commentController.createComment);
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.get('/post/:postId', commentController.getCommentsByPost);
router.put('/:id', commentController.updateComment); 
router.delete('/:id', commentController.deleteComment);

export default router;