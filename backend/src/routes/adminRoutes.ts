import express from 'express'
import { loginController,forgotPasswordSendOtp,setNewPassword,adminLogout } from '../controllers/adminControllers/authControllers'
import { authenticateAdmin } from '../middlewares/adminAuthMiddleware'
import {createBunk,getBookings,updateBookingStatus,getBunksList,updateBunks,getAdmin,getDashboardData} from '../controllers/adminControllers/AdminRolesController'
const adminRoutes=express.Router()


adminRoutes.post('/auth/login',loginController)
adminRoutes.post('/auth/forgotEmail',forgotPasswordSendOtp)
adminRoutes.post('/auth/newPassword',setNewPassword)
adminRoutes.post('/auth/logout',adminLogout)



// admin Roles
adminRoutes.post('/roles/createBunk',authenticateAdmin,createBunk)
adminRoutes.get('/roles/getBookings',authenticateAdmin,getBookings)
adminRoutes.patch('/role/updateBookingStatus',authenticateAdmin,updateBookingStatus)
adminRoutes.get('/role/bunksdetails',authenticateAdmin,getBunksList)
adminRoutes.patch('/role/Updatebunks/:bunkId',authenticateAdmin,updateBunks)
adminRoutes.post('/role/getDetails',getAdmin)
adminRoutes.get('/role/getDashboardData',authenticateAdmin,getDashboardData)


export default adminRoutes