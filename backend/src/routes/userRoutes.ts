import express from "express";
import {
  userLogin,
  signUpController,
  createUser,
  setOtpForgotPassword,
  ResetPassword,
  userLogout,
} from "../controllers/userControllers/authControllers";
import {
  getBunks,
  bookingBunk,
  bookingLists,
  getUser,
  cancelBooking,
  getUserAuthenticate,
} from "../controllers/userControllers/activitiesController";
import { authenticateUser } from "../middlewares/userAuthMiddleware";

const userRoute = express.Router();

// auth controller
userRoute.post("/auth/login", userLogin);
userRoute.post("/auth/signUp", signUpController);
userRoute.post("/auth/submitOtp", createUser);
userRoute.post("/auth/forgotEmail", setOtpForgotPassword);
userRoute.post("/auth/newPassword", ResetPassword);
userRoute.post("/auth/logout", userLogout);

// user Activities
userRoute.get("/getBunkList",authenticateUser, getBunks);
userRoute.get("/profile/getDetails", getUser);
userRoute.get("/getBookingHistory",authenticateUser, bookingLists);
userRoute.post("/bookBunk",authenticateUser, bookingBunk);
userRoute.patch("/cancelBooking/:id",authenticateUser, cancelBooking);
userRoute.get("/getDetails", getUserAuthenticate);

export default userRoute;
