import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../model/user.model.js";
import LlamaAI from 'llamaai';
// const apiToken = 'INSERT_YOUR_API_TOKEN_HERE';
// const { CohereClient } = require('cohere-ai');

import { CohereClient } from 'cohere-ai'
const cohere = new CohereClient({
  token: process.env.LLAMA,
});



// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
import OpenAI from "openai";
import { upload } from "../utils/Upload.js";
// ApiResponse
const openai = new OpenAI(
  {
    apiKey : process.env.OPENAI_API_KEY
  }
);

export const llama = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user._id);
  if (user.credit < 10) {
    return res.status(403).json(new ApiResponse(403, null, "Insufficient credits"));
  }
  user.credit -= 10;
  await user.save();
  const response = await cohere.chat({
		message: `${req.body.query}`
  })
  console.log(response);
  res.status(200).json(response);
})

export const GptResponse2 = asyncHandler(async (req,res)=>{
  const {query} = req.body;
  // console.log("working");
  console.log(query);
  const user = await User.findById(req.user._id);
  console.log(user);
  if (user.credit < 10) {
    return res.status(403).json(new ApiResponse(403, null, "Insufficient credits"));
  }
  user.credit -= 10;
  await user.save();
  console.log("working");
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": `${query}`}],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
  
  
  

  // console.log(completion.choices[0]);
  res.status(200).json(
    new ApiResponse(
      200,
      {
          Output: completion.choices[0].message.content
      },
      "done"
  )
  )
})







export const GptResponse = asyncHandler(async (req,res)=>{
  const {query} = req.body;
  // console.log(query);
  const user = await User.findById(req.user._id);
  if (user.credit < 10) {
    return res.status(403).json(new ApiResponse(403, null, "Insufficient credits"));
  }
  user.credit -= 10;
  await user.save();

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `${query}` }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
  res.status(200).json(
    new ApiResponse(
      200,
      {
          Output: completion.choices[0].message.content
      },
      "done"
  )
  )
})


const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


export const GeminiResponse = asyncHandler(async (req,res)=>{
  // console.log("working till");
  // console.log(req.body.query);
  const {query} = req.body;
  // console.log(req.file);
  const user = await User.findById(req.user._id);
  if (user.credit < 10) {
    return res.status(403).json(new ApiResponse(403, null, "Insufficient credits"));
  }
  user.credit -= 10;
  await user.save();
  const result = await model.generateContent([
    `${query}`,
    {inlineData: {data: Buffer.from(fs.readFileSync(`${req.file.path}`)).toString("base64"), 
    mimeType: 'image/png/jpeg'}}]
  );
  // console.log(result.response.text());
  // console.log(text);
  fs.unlinkSync(req.file.path);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        Output: result.response.text()
        },
        "done"
        )
      )
})
