import express from 'express'
import { loginController,forgotPasswordSendOtp,setNewPassword } from '../controllers/adminControllers/authControllers'
const adminRoutes=express.Router()

adminRoutes.post('/auth/login',loginController)
adminRoutes.post('/auth/forgotEmail',forgotPasswordSendOtp)
adminRoutes.post('/auth/newPassword',setNewPassword)

export default adminRoutes