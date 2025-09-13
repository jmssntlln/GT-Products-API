import express from 'express';
import postRoutes from './src/routes/post.routes.js';
import commentRoutes from './src/routes/comment.routes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/posts', postRoutes);

app.use('/comments', commentRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});