import { Router } from 'express';
import * as photoController from '../controllers/photo.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', photoController.getUserPhotos);
router.delete('/:id', photoController.deleteUserPhoto);

router.post('/upload', upload.single('photo'), photoController.uploadPhoto);

export default router;