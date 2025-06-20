"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/adminControllers/authControllers");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const AdminRolesController_1 = require("../controllers/adminControllers/AdminRolesController");
const adminRoutes = express_1.default.Router();
adminRoutes.post('/auth/login', authControllers_1.loginController);
adminRoutes.post('/auth/forgotEmail', authControllers_1.forgotPasswordSendOtp);
adminRoutes.post('/auth/newPassword', authControllers_1.setNewPassword);
adminRoutes.post('/auth/logout', authControllers_1.adminLogout);
// admin Roles
adminRoutes.post('/roles/createBunk', adminAuthMiddleware_1.authenticateAdmin, AdminRolesController_1.createBunk);
adminRoutes.get('/roles/getBookings', adminAuthMiddleware_1.authenticateAdmin, AdminRolesController_1.getBookings);
adminRoutes.patch('/role/updateBookingStatus', adminAuthMiddleware_1.authenticateAdmin, AdminRolesController_1.updateBookingStatus);
adminRoutes.get('/role/bunksdetails', adminAuthMiddleware_1.authenticateAdmin, AdminRolesController_1.getBunksList);
adminRoutes.patch('/role/Updatebunks/:bunkId', adminAuthMiddleware_1.authenticateAdmin, AdminRolesController_1.updateBunks);
adminRoutes.post('/role/getDetails', AdminRolesController_1.getAdmin);
adminRoutes.get('/role/getDashboardData', adminAuthMiddleware_1.authenticateAdmin, AdminRolesController_1.getDashboardData);
exports.default = adminRoutes;
