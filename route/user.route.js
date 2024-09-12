import express from "express";
import { LoginUser, Logout, RegisterUser , getToken} from "../controller/user.controller.js";
import { verifyJWT } from "../utils/verifyJWT.js";

// console.log(process.env)
const userrouter = express.Router();


userrouter.post('/v1/user/login',LoginUser);


userrouter.post('/v1/user/register',RegisterUser);
userrouter.get('/v1/user/token', verifyJWT, getToken);

userrouter.post('/v1/user/logout',verifyJWT,Logout);


// http://localhost:3000/auth/google/callback






export default userrouter;