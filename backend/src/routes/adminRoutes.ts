import express from 'express'
import { loginController,forgotPasswordSendOtp,setNewPassword } from '../controllers/adminControllers/authControllers'
import {createBunk,getBookings,updateBookingStatus,getBunksList} from '../controllers/adminControllers/AdminRolesController'
const adminRoutes=express.Router()


adminRoutes.post('/auth/login',loginController)
adminRoutes.post('/auth/forgotEmail',forgotPasswordSendOtp)
adminRoutes.post('/auth/newPassword',setNewPassword)



// admin Roles
adminRoutes.post('/roles/createBunk',createBunk)
adminRoutes.get('/roles/getBookings',getBookings)
adminRoutes.patch('/role/updateBookingStatus',updateBookingStatus)
adminRoutes.patch('/role/bunksdetails',getBunksList)

export default adminRoutes