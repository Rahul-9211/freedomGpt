import express from "express";
import { verifyJWT } from "../utils/verifyJWT.js";
import {
  GptResponse,
  GeminiResponse,
  GptResponse2,
  llama,
} from "../controller/ai.controller.js";
import { upload } from "../utils/Upload.js";
const AIRoute = express.Router();

AIRoute.post("/v1/ai/gpt", verifyJWT, GptResponse);

AIRoute.post(
  "/v1/ai/gemini",
  verifyJWT,
  upload.single("file1"),
  GeminiResponse
);

AIRoute.post("/v1/ai/gptmini", verifyJWT, GptResponse2);

AIRoute.post("/v1/ai/lama", verifyJWT, llama);

export default AIRoute;
