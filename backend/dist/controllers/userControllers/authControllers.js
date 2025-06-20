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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.ResetPassword = exports.setOtpForgotPassword = exports.createUser = exports.signUpController = exports.userLogin = void 0;
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const sendOtp_1 = require("../../utils/sendOtp");
const passwordHash_1 = __importDefault(require("../../utils/passwordHash"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const { email, password } = req.body;
        const findUser = yield userSchema_1.default.findOne({ email });
        if (!findUser || !findUser.password) {
            return res
                .status(200)
                .json({ success: false, message: "User not found " });
        }
        const registeredPassword = findUser.password;
        const checkPassword = yield bcrypt_1.default.compare(password, registeredPassword);
        if (!checkPassword) {
            return res
                .status(200)
                .json({ success: false, message: "Incorrect password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: findUser._id, email: findUser.email }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({ success: true, userId: findUser._id });
    }
    catch (error) {
        console.log("error in userLogin in userside", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.userLogin = userLogin;
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, phone, email, password, confirmPassword } = req.body.formdata;
        if (!fullName && !phone && !email && !password && !confirmPassword) {
            res.status(200).json({ success: false, message: "fill all the feilds" });
        }
        if (password !== confirmPassword) {
            res
                .status(200)
                .json({ success: false, message: "passwords are not matched" });
        }
        const userExist = yield userSchema_1.default.findOne({ email: email });
        if (userExist) {
            res.status(200).json({ success: false, message: "User already exists " });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        const success = yield (0, sendOtp_1.sendOtp)(email, otp);
        if (!success) {
            res.status(200).json({ success: false, message: "Server Error " });
        }
        console.log("otp: ", otp);
        res.status(200).json({ success: true, otp });
    }
    catch (error) {
        console.log("error in signUp controller in userside", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.signUpController = signUpController;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const _a = req.body, { enterdOtp, otpFromBackend } = _a, formdata = __rest(_a, ["enterdOtp", "otpFromBackend"]);
        const findUser = yield userSchema_1.default.findOne({ email: formdata.email });
        if (findUser) {
            return res
                .status(200)
                .json({ success: false, message: "User already exists" });
        }
        if (enterdOtp !== otpFromBackend) {
            return res
                .status(200)
                .json({ success: false, message: "Incorrect OTP. Try again." });
        }
        const passwordHash = yield (0, passwordHash_1.default)(formdata.password);
        if (!passwordHash) {
            return res
                .status(200)
                .json({ success: false, message: "Server error, try later" });
        }
        const newUser = new userSchema_1.default({
            name: formdata.fullName,
            email: formdata.email,
            phone: formdata.phone,
            password: passwordHash,
        });
        const savedUser = yield newUser.save();
        if (!savedUser) {
            return res
                .status(200)
                .json({ success: false, message: "Couldn’t sign up, try again later" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: savedUser._id, email: savedUser.email }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({ success: true, userId: savedUser._id });
    }
    catch (error) {
        console.log("Error in createUser:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
});
exports.createUser = createUser;
const setOtpForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const findUser = yield userSchema_1.default.findOne({ email });
        if (!findUser) {
            return res
                .status(200)
                .json({ success: false, message: "Couldint find user in this email" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        console.log("otp: ", otp);
        return res.status(200).json({ success: true, otp });
    }
    catch (error) {
        console.log("Error in setOtpForgotPassword:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
});
exports.setOtpForgotPassword = setOtpForgotPassword;
const ResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const { newPassword, email } = req.body;
        const findUser = yield userSchema_1.default.findOne({ email });
        if (!findUser)
            return res
                .status(200)
                .json({ success: false, message: "Couldint find user in this email" });
        const passwordHash = yield (0, passwordHash_1.default)(newPassword);
        if (!passwordHash)
            return res
                .status(200)
                .json({ success: false, message: "Server error try later" });
        const updateUser = yield userSchema_1.default.findByIdAndUpdate(findUser._id, { $set: { password: passwordHash } }, { new: true });
        if (!updateUser)
            return res
                .status(200)
                .json({ success: false, message: "Server error try later" });
        const token = jsonwebtoken_1.default.sign({ userId: findUser._id, email: findUser.email }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({ success: true, userId: findUser._id });
    }
    catch (error) {
        console.log("Error in ResetPassword:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
});
exports.ResetPassword = ResetPassword;
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const findUser = yield userSchema_1.default.findById(userId);
        if (!findUser)
            return res
                .status(200)
                .json({ success: false, message: "couldint find user details" });
        res.clearCookie("userToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        console.log("error in userLogout admin side");
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.userLogout = userLogout;
