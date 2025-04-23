import express from 'express'
import { loginController } from '../controllers/adminControllers/authControllers'
const adminRoutes=express.Router()

adminRoutes.post('/auth/login',loginController)

export default adminRoutes