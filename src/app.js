import express from 'express';
import passport from 'passport';
import { sessionMiddleware } from 'passport';
import { authRouter } from './routes/auth.js';

const app = express();


app.use(sessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
