"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogout = exports.setNewPassword = exports.forgotPasswordSendOtp = exports.loginController = void 0;
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passwordHash_1 = __importDefault(require("../../utils/passwordHash"));
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const { email, password } = req.body;
        const findAdmin = yield userSchema_1.default.findOne({ email, isAdmin: true });
        if (!findAdmin || !findAdmin.password)
            return res
                .status(200)
                .json({ success: false, message: "Admin not found " });
        const registeredPassword = findAdmin.password;
        const checkPassword = yield bcrypt_1.default.compare(password, registeredPassword);
        if (!checkPassword)
            return res
                .status(200)
                .json({ success: false, message: "Incorrect password" });
        const token = jsonwebtoken_1.default.sign({ userId: findAdmin._id, email: findAdmin.email }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ success: true, adminId: findAdmin._id });
    }
    catch (error) {
        console.log("error in loginController admin side");
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.loginController = loginController;
const forgotPasswordSendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const findAdmin = yield userSchema_1.default.findOne({ email, isAdmin: true });
        if (!findAdmin)
            return res
                .status(200)
                .json({ success: false, message: "Admin not found " });
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        console.log("otp: ", otp);
        return res.status(200).json({ success: true, otp });
    }
    catch (error) {
        console.log("error in forgotPasswordSendOtp admin side");
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.forgotPasswordSendOtp = forgotPasswordSendOtp;
const setNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const { email, password } = req.body;
        const findAdmin = yield userSchema_1.default.findOne({ email, isAdmin: true });
        if (!findAdmin)
            return res
                .status(200)
                .json({ success: false, message: "Admin not found " });
        const hashNewPassword = yield (0, passwordHash_1.default)(password);
        if (!hashNewPassword)
            return res.status(200).json({ success: false, message: "Server error " });
        const updateAdminPassword = yield userSchema_1.default.findByIdAndUpdate(findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin._id, { $set: { password: hashNewPassword } }, { new: true });
        if (!updateAdminPassword)
            return res
                .status(200)
                .json({ success: false, message: "Couldint update password" });
        const token = jsonwebtoken_1.default.sign({ userId: findAdmin._id, email: findAdmin.email }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res
            .status(200)
            .json({ success: true, adminId: updateAdminPassword._id });
    }
    catch (error) {
        console.log("error in setNewPassword admin side");
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.setNewPassword = setNewPassword;
const adminLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.query;
        const findAdmin = yield userSchema_1.default.findById(adminId);
        if (!findAdmin)
            return res
                .status(200)
                .json({ success: false, message: "couldint find admin details" });
        res.clearCookie("adminToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        console.log("error in adminLogout admin side");
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.adminLogout = adminLogout;
