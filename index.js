import express from 'express';
import morgan from 'morgan';
import postRoutes from './src/routes/post.routes.js';
import userRoutes from './src/routes/user.routes.js';
import commentRoutes from './src/routes/comment.routes.js'; // Add this line
import { testConnection } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';

const app = express();
const nodeEnv = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT || 3000);

if (nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes); // Add this line

app.use(errorHandler);

testConnection();

app.listen(port, () => {
    console.log(
        `Server is running on http://localhost:${port} in ${nodeEnv} mode`
    );
});