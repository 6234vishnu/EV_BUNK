import express from 'express'
import { loginController,forgotPasswordSendOtp,setNewPassword,adminLogout } from '../controllers/adminControllers/authControllers'
import {createBunk,getBookings,updateBookingStatus,getBunksList,updateBunks,getAdmin,getDashboardData} from '../controllers/adminControllers/AdminRolesController'
const adminRoutes=express.Router()


adminRoutes.post('/auth/login',loginController)
adminRoutes.post('/auth/forgotEmail',forgotPasswordSendOtp)
adminRoutes.post('/auth/newPassword',setNewPassword)
adminRoutes.post('/auth/logout',adminLogout)



// admin Roles
adminRoutes.post('/roles/createBunk',createBunk)
adminRoutes.get('/roles/getBookings',getBookings)
adminRoutes.patch('/role/updateBookingStatus',updateBookingStatus)
adminRoutes.get('/role/bunksdetails',getBunksList)
adminRoutes.patch('/role/Updatebunks/:bunkId',updateBunks)
adminRoutes.get('/role/getDetails',getAdmin)
adminRoutes.get('/role/getDashboardData',getDashboardData)


export default adminRoutes