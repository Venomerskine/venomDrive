import express from 'express';
import passport from './auth.js';
import { sessionMiddleware } from './session.js';
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from "url";
import indexRouter from './routes/index.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
console.log("Static path:", path.join(__dirname, "public"));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// app.use('/uploads', express.static('uploads'));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});