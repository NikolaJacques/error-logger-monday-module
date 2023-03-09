import express, { Request, Response, NextFunction, } from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import receiverRoutes from './routes/receiver';
import mongoose from 'mongoose';
import {MONGO_MONDAY_ERROR_LOGS} from './env';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', receiverRoutes);

app.use((err: Error, _: Request, res: Response, _2: NextFunction) => {
    res.status(500).json({...err});
});

mongoose.connect(MONGO_MONDAY_ERROR_LOGS!);

app.listen(4000);