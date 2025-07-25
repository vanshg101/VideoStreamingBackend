import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email : ", email);

  //    if(fullName===""){
  //     throw new ApiError(400,"fullName is require")
  //    }
  //like this one by one or this advance code

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "username or email already exist");
  }

  const avtarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalath = req.files?.coverImage[0]?.path;

  if(!avtarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }
  
  const avatar=await uploadOnCloudinary(avtarLocalPath);
  const coverImage=await uploadOnCloudinary(coverImageLocalath);

   if(!avatar){
    throw new ApiError(400,"Avatar file is required")
  }

  const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
  )
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered sucessfull<")
    )

});

export { registerUser };
