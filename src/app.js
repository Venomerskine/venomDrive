import express from 'express';
import passport from './auth.js';
import { sessionMiddleware } from './session.js';
import dotenv from 'dotenv'
import path from 'path'
import indexRouter from './routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});