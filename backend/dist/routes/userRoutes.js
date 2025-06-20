"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/userControllers/authControllers");
const activitiesController_1 = require("../controllers/userControllers/activitiesController");
const userAuthMiddleware_1 = require("../middlewares/userAuthMiddleware");
const userRoute = express_1.default.Router();
// auth controller
userRoute.post("/auth/login", authControllers_1.userLogin);
userRoute.post("/auth/signUp", authControllers_1.signUpController);
userRoute.post("/auth/submitOtp", authControllers_1.createUser);
userRoute.post("/auth/forgotEmail", authControllers_1.setOtpForgotPassword);
userRoute.post("/auth/newPassword", authControllers_1.ResetPassword);
userRoute.post("/auth/logout", authControllers_1.userLogout);
// user Activities
userRoute.get("/getBunkList", userAuthMiddleware_1.authenticateUser, activitiesController_1.getBunks);
userRoute.get("/profile/getDetails", activitiesController_1.getUser);
userRoute.get("/getBookingHistory", userAuthMiddleware_1.authenticateUser, activitiesController_1.bookingLists);
userRoute.post("/bookBunk", userAuthMiddleware_1.authenticateUser, activitiesController_1.bookingBunk);
userRoute.patch("/cancelBooking/:id", userAuthMiddleware_1.authenticateUser, activitiesController_1.cancelBooking);
userRoute.get("/getDetails", activitiesController_1.getUserAuthenticate);
exports.default = userRoute;
