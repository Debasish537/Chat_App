import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

//ALL ROUTINGS
const userRouter = express.Router();

userRouter.post("/signup",signup)
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute,updateProfile)//put due to we have to update the data
userRouter.get("/check",protectRoute,checkAuth)

export default userRouter;