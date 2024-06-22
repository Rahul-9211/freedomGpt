import User from "../model/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import Token from "../model/token.model.js"
import {generateAccessToken} from "../utils/token.js"
export const RegisterUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, username } = req.body;
  const user = await User.findOne({ email: email });
  // console.log(user);
  if (user) {
    console.log("working");
    throw new ApiError(409, "User Already have Account");
  }
  if (!req.body.firstname) {
    throw new ApiError(400, "Please Enter Firstname");
  }
  if (!req.body.lastname) {
    throw new ApiError(400, "Please Enter Lastname");
  }
  if (!req.body.email) {
    throw new ApiError(400, "Please Enter Email");
  }
  if (!req.body.password) {
    throw new ApiError(400, "Please Enter Password");
  }
  if (!req.body.username) {
    throw new ApiError(400, "Please Enter Username");
  }
  // const date = new Date();
  const userCreated = await User.create({
    firstname,
    lastname,
    email,
    password,
    activeStatus: true,
    username,
  });
  console.log(userCreated);
  userCreated.ModificationTimeline.push({
    user: userCreated._id,
    action: "created",
  });
  await userCreated.save();
  if (!userCreated) {
    throw new ApiError(500, "Failed to create user");
  }
  const createdUser = await User.findById(userCreated._id).select("-password");
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Created Succesfully"));
});

export const LoginUser = asyncHandler(async (req,res)=>{
  const user = await User.findOne({email : req.body.email});
  if(!user){
   throw new ApiError(404,"User Not Found");
  }
  if(!req.body.password){
    throw new ApiError(400,"Please Enter Password");
  }
  // if(!User.isPasswordCorrect(req.body.password)){
  //   throw new ApiError(401,"Incorrect Password");
  // }
  const token = await Token.create();
  // const AccessToken = await token.generateAccessToken(
  //   {
  //     user : user._id
  //   }
  // );
  // const RefreshToken = await Token.generateRefreshToken(
  //   {
  //     user : user._id
  //   }
  // )
  console.log(AccessToken);
  // console.log(RefreshToken);
  


  // user.generateAccessToken()
})
