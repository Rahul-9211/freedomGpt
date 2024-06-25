import express from 'express';
import 'dotenv/config'
import cookieParser from "cookie-parser";

import { ConnectDB } from './utils/dbconnection.js';
import userrouter from './route/user.route.js';
import googleRouter from './route/user.google.js';
import AIRoute from './route/airoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect to the database
ConnectDB();
app.use(express.json());
app.use(cookieParser());
app.use('/', userrouter);
app.use('/', googleRouter);
app.use('/',AIRoute);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
