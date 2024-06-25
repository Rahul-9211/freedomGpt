import express from "express";
import { verifyJWT } from "../utils/verifyJWT.js";
import { GptResponse } from "../controller/ai.controller.js";

const AIRoute = express.Router();


AIRoute.post('/v1/ai/gpt',verifyJWT,GptResponse)




export default AIRoute;