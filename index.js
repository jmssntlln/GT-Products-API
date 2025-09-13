import express from 'express';
import morgan from 'morgan'; 
import postRoutes from './src/routes/post.routes.js';
import config from './src/config/index.js';

const app = express();

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); 
}

app.use(express.json());
app.use('/posts', postRoutes);

app.listen(config.port, () => {
  console.log(
    `Server is running on http://localhost:${config.port} in ${config.nodeEnv} mode`
  );
});
