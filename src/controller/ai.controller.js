import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import OpenAI from "openai";
// ApiResponse
const openai = new OpenAI(
  {
    apiKey : process.env.OPENAI_API_KEY
  }
);
export const GptResponse = asyncHandler(async (req,res)=>{
  const {query} = req.body;
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

