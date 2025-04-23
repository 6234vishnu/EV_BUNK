import express from 'express'
import { loginController } from '../controllers/userControllers/authControllers'
const userRoute=express.Router()

userRoute.post('/auth/login',loginController)



export default userRoute