import express from "express";
import { RegisterUser } from "../controller/user.controller.js";

const userrouter = express.Router();

userrouter.post('/v1/user/login');

userrouter.post('/v1/user/register',RegisterUser);

userrouter.post('v1/user/logout');



export default userrouter;