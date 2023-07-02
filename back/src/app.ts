import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routers/authRouter/authRouter';
import userRouter from './routers/userRouter/userRouter';
import eventRouter from './routers/eventRouter/eventRouter';
import supportRouter from './routers/supportRouter/supportRouter';
import errorController from './controllers/errorController/errorController';

const app = express();

// Middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routers
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use('/support', supportRouter);

// Error handler
app.use('*', errorController);

export default app;
