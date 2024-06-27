import express from 'express';
import 'dotenv/config'
import 'module-alias/register.js';
import cookieParser from "cookie-parser";

import { ConnectDB } from './src/connection/dbconnection.js';
import userrouter from './src/route/user.route.js';
import googleRouter from './src/route/user.google.js';
import AIRoute from './src/route/airoute.js';

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
