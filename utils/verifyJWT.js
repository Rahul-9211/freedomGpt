import JWT from 'jsonwebtoken';
import ApiError from "./apiError.js";
import asyncHandler from "./asyncHandler.js";
import ApiResponse from "./apiResponse.js";
import User from "../model/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
  try {
      const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
          throw new ApiError(401, "Unauthorized request");
      }
  
      const decodedToken = JWT.verify(accessToken, process.env.SECRET_KEY_ACCESS);
  
      const user = await User.findById(decodedToken?._id).select(" -password -refreshToken");
  
      if (!user) {
          throw new ApiError(401, "Invalid access token");
      }
  
      req.user = user;
      next();
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
  }
});

