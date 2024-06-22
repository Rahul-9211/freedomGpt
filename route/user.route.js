import express from "express";
import { LoginUser, RegisterUser } from "../controller/user.controller.js";

const userrouter = express.Router();

userrouter.post('/v1/user/login',LoginUser);

userrouter.post('/v1/user/register',RegisterUser);

userrouter.post('v1/user/logout');



export default userrouter;