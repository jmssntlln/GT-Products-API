import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import * as commentController from '../controllers/comment.controller.js';
import { validatePost, validateComment } from '../middlewares/validator.middleware.js';

const router = Router();

router.get('/', postController.getAllPosts);
router.post('/', validatePost, postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.patch('/:id', postController.patchPost);
router.delete('/:id', postController.deletePost);
router.get('/:postId/comments', commentController.getCommentsByPost);
router.post('/:postId/comments', validateComment, commentController.createCommentForPost);

export default router;