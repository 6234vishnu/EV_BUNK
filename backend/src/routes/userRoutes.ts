import express from 'express'
import { userLogin,signUpController,createUser,setOtpForgotPassword,ResetPassword } from '../controllers/userControllers/authControllers'
import {getBunks} from "../controllers/userControllers/activitiesController"
const userRoute=express.Router()


// auth controller
userRoute.post('/auth/login',userLogin)
userRoute.post('/auth/signUp',signUpController)
userRoute.post('/auth/submitOtp',createUser)
userRoute.post('/auth/forgotEmail',setOtpForgotPassword)
userRoute.post('/auth/newPassword',ResetPassword)

// user Activities
userRoute.get('/getBunkList',getBunks)



export default userRoute