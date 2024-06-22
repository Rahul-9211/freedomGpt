import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({
  path: '.env'
});

console.log(process.env.MONGO_DB_CONNECTION_URL)
import { ConnectDB } from './utils/dbconnection.js';
import userrouter from './route/user.route.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect to the database
ConnectDB();
app.use(express.json());
app.use('/',userrouter);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
