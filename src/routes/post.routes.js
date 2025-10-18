import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import * as commentController from '../controllers/comment.controller.js';
import { validatePost, validateComment } from '../middlewares/validator.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', postController.getAllPosts);
router.post('/', authenticate, validatePost, postController.createPost);
router.get('/:id', postController.getPostById);
router.patch('/:id', postController.patchPost);
router.get('/:postId/comments', commentController.getCommentsByPost);
router.post('/:postId/comments', validateComment, commentController.createCommentForPost);
router.put('/:id', authenticate, validatePost, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

export default router;