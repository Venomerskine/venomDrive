import express from 'express';
import dotenv from 'dotenv'
import path from 'path'
import indexRouter from './routes/index.js';

const app = express();

app.use("/", indexRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});