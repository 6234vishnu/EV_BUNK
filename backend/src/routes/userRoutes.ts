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
} from "../controllers/userControllers/activitiesController";
const userRoute = express.Router();

// auth controller
userRoute.post("/auth/login", userLogin);
userRoute.post("/auth/signUp", signUpController);
userRoute.post("/auth/submitOtp", createUser);
userRoute.post("/auth/forgotEmail", setOtpForgotPassword);
userRoute.post("/auth/newPassword", ResetPassword);
userRoute.post("/auth/logout", userLogout);

// user Activities
userRoute.get("/getBunkList", getBunks);
userRoute.get("/profile/getDetails", getUser);
userRoute.get("/getBookingHistory", bookingLists);
userRoute.post("/bookBunk", bookingBunk);
userRoute.patch("/cancelBooking/:id", cancelBooking);

export default userRoute;
