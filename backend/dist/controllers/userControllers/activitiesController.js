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
exports.getUserAuthenticate = exports.cancelBooking = exports.getUser = exports.bookingLists = exports.bookingBunk = exports.getBunks = void 0;
const bunkSchema_1 = __importDefault(require("../../models/bunkSchema"));
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const bookingModel_1 = __importDefault(require("../../models/bookingModel"));
const getBunks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findBunks = yield bunkSchema_1.default.find();
        if (!findBunks)
            return res
                .status(200)
                .json({ success: false, message: "couldint find any Bunks try later" });
        return res.status(200).json({ success: true, bunks: findBunks });
    }
    catch (error) {
        console.log("error in get Bunks in user side activities controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error try later" });
    }
});
exports.getBunks = getBunks;
const bookingBunk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slotTime, bookingDate, vehicleNumber, connectorType, chargingType, status, price, } = req.body;
        const { userId, bunkId } = req.query;
        const findUser = yield userSchema_1.default.findOne({ _id: userId, isBlocked: false });
        if (!findUser)
            return res
                .status(200)
                .json({ success: false, message: "Couldint find User" });
        const findBunk = yield bunkSchema_1.default.findOne({ _id: bunkId, allowBooking: true });
        if (!findBunk)
            return res
                .status(200)
                .json({ success: false, message: "Couldint find Bunk" });
        if (!slotTime &&
            !bookingDate &&
            !vehicleNumber &&
            !connectorType &&
            !chargingType &&
            !status &&
            !price) {
            return res.status(200).json({
                success: false,
                message: "fill all the details before submission",
            });
        }
        const newBooking = new bookingModel_1.default({
            user: findUser._id,
            bunk: findBunk._id,
            slotTime,
            bookingDate,
            vehicleNumber,
            connectorType,
            chargingType,
            status,
            price,
        });
        const saveBooking = yield newBooking.save();
        if (!saveBooking)
            return res
                .status(200)
                .json({ success: false, message: "Internal server error try later" });
        return res
            .status(200)
            .json({ success: true, message: "Booking SuccessFull" });
    }
    catch (error) {
        console.log("error in bookingBunk in user side activities controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error try later" });
    }
});
exports.bookingBunk = bookingBunk;
const bookingLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const getBookings = yield bookingModel_1.default.find({ user: userId });
        if (!getBookings)
            return res
                .status(200)
                .json({ success: false, message: "couldint get any past bookings" });
        return res.status(200).json({ success: true, bookings: getBookings });
    }
    catch (error) {
        console.log("error in bookingLists in user side activities controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error try later" });
    }
});
exports.bookingLists = bookingLists;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const findUser = yield userSchema_1.default.findById(userId).sort({ createdAt: -1 });
        if (!findUser)
            return res
                .status(200)
                .json({ success: false, message: "couldint find user details" });
        return res.status(200).json({ success: true, user: findUser });
    }
    catch (error) {
        console.log("error in getUser in user side activities controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error try later" });
    }
});
exports.getUser = getUser;
const cancelBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cancelBookingId = req.params.id;
        const updateBooking = yield bookingModel_1.default.findByIdAndUpdate(cancelBookingId, { $set: { status: "Cancelled" } }, { new: true });
        if (!updateBooking)
            return res
                .status(200)
                .json({ success: false, message: "couldint cancel Booking" });
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.log("error in cancelBooking in user side activities controller", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error try later" });
    }
});
exports.cancelBooking = cancelBooking;
const getUserAuthenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const finduser = yield userSchema_1.default.findById(userId);
        if (!finduser)
            return res
                .status(200)
                .json({ success: false, message: "couldint find User" });
        res.status(200).json({ success: true, admin: finduser });
    }
    catch (error) {
        console.log("Error in getUserAuthenticate:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again later.",
        });
    }
});
exports.getUserAuthenticate = getUserAuthenticate;
