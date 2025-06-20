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
exports.getDashboardData = exports.getAdmin = exports.updateBunks = exports.getBunksList = exports.updateBookingStatus = exports.getBookings = exports.createBunk = void 0;
const bunkSchema_1 = __importDefault(require("../../models/bunkSchema"));
const bookingModel_1 = __importDefault(require("../../models/bookingModel"));
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const date_fns_1 = require("date-fns");
const createBunk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, city, contactNo, longitude, latitude, mapEmbed, totalPorts, availablePorts, chargingType, supportedConnectors, pricePerKWh, flatRate, is24Hours, status, allowBooking, } = req.body;
        if (!name ||
            !address ||
            !city ||
            !longitude ||
            !latitude ||
            !contactNo ||
            !mapEmbed ||
            totalPorts <= 0 ||
            !supportedConnectors ||
            supportedConnectors.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Missing required fields or invalid data.",
            });
        }
        const bunkExists = yield bunkSchema_1.default.findOne({ mapEmbed });
        if (bunkExists) {
            return res.status(200).json({
                success: false,
                message: "Bunk already exists at the exact location. Try another one.",
            });
        }
        const createNewBunk = new bunkSchema_1.default({
            name,
            address,
            city,
            contactNo,
            mapEmbed,
            totalPorts,
            availablePorts,
            chargingType,
            supportedConnectors,
            pricePerKWh,
            flatRate,
            is24Hours,
            status,
            allowBooking,
            latitude,
            longitude,
            location: {
                type: "Point",
                coordinates: [longitude, latitude], // IMPORTANT: longitude first
            },
        });
        const saveBunk = yield createNewBunk.save();
        if (!saveBunk) {
            return res.status(200).json({
                success: false,
                message: "Could not create bunk, try again later.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Bunk created successfully.",
        });
    }
    catch (error) {
        console.log("Error in createBunk in adminRolesController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again later.",
        });
    }
});
exports.createBunk = createBunk;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getBooking = yield bookingModel_1.default.find().sort({ createdAt: -1 });
        if (!getBooking)
            return res.status(200).json({
                success: false,
                message: "Internal server error, try again later.",
            });
        return res.status(200).json({
            success: true,
            bookings: getBooking,
        });
    }
    catch (error) {
        console.log("Error in createBunk in getBookings:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again later.",
        });
    }
});
exports.getBookings = getBookings;
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId, status } = req.body;
        const updateBookingStatus = yield bookingModel_1.default.findByIdAndUpdate(bookingId, { $set: { status } }, { new: true });
        if (!updateBookingStatus)
            return res.status(200).json({
                success: false,
                message: "Internal server error, try again later.",
            });
        return res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        console.log("Error in updateBookingStatus:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again later.",
        });
    }
});
exports.updateBookingStatus = updateBookingStatus;
const getBunksList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getBunks = yield bunkSchema_1.default.find();
        if (!getBunks)
            return res
                .status(200)
                .json({ success: false, message: "couldint get any Bunks" });
        return res.status(200).json({ success: true, bunks: getBunks });
    }
    catch (error) {
        console.log("Error in getBunksList:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again later.",
        });
    }
});
exports.getBunksList = getBunksList;
const updateBunks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, city, contactNo, location, mapEmbed, totalPorts, availablePorts, chargingType, supportedConnectors, pricePerKWh, flatRate, is24Hours, status, allowBooking, landmarks, latitude, longitude, } = req.body.formData;
        const bunkID = req.params.bunkId;
        const updateBunk = yield bunkSchema_1.default.findByIdAndUpdate(bunkID, {
            name,
            address,
            city,
            contactNo,
            location,
            mapEmbed,
            totalPorts,
            availablePorts,
            chargingType,
            supportedConnectors,
            pricePerKWh,
            flatRate,
            is24Hours,
            status,
            allowBooking,
            landmarks,
            latitude,
            longitude,
            updatedAt: new Date(),
        }, { new: true });
        if (!updateBunk)
            return res
                .status(200)
                .json({ success: false, message: "couldint update Bunks" });
        return res
            .status(200)
            .json({ success: true, message: "bunk Updated SuccessFully" });
    }
    catch (error) {
        console.log("Error in updateBunks:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again later.",
        });
    }
});
exports.updateBunks = updateBunks;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.query;
        const findAdmin = yield userSchema_1.default.findOne({ _id: adminId, isAdmin: true });
        if (!findAdmin)
            return res
                .status(400)
                .json({ success: false, message: "couldint find Admin" });
        res.status(200).json({ success: true, admin: findAdmin });
    }
    catch (error) {
        console.log("Error in getAdmin:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again later.",
        });
    }
});
exports.getAdmin = getAdmin;
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const getMonthName = (monthNumber) => {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return months[monthNumber - 1];
    };
    try {
        const startOfCurrentMonth = (0, date_fns_1.startOfMonth)(new Date());
        const endOfCurrentMonth = (0, date_fns_1.endOfMonth)(new Date());
        const getBookings = bookingModel_1.default.aggregate([
            {
                $project: {
                    month: { $month: "$bookingDate" },
                    bookingDate: 1,
                },
            },
            {
                $group: {
                    _id: "$month",
                    bookings: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        const chargingBunks = bunkSchema_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    available: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "active"] }, 1, 0],
                        },
                    },
                    unavailable: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "inactive"] }, 1, 0],
                        },
                    },
                },
            },
        ]);
        const totalAmountsFromBookings = bookingModel_1.default.aggregate([
            {
                $match: {
                    bookingDate: {
                        $gte: startOfCurrentMonth,
                        $lt: endOfCurrentMonth,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$price" },
                },
            },
        ]);
        const [bookings, chargingStations, totalBookings] = yield Promise.all([
            getBookings,
            chargingBunks,
            totalAmountsFromBookings,
        ]);
        const formattedBookings = bookings.map((booking) => ({
            month: getMonthName(booking._id),
            bookings: booking.bookings,
        }));
        return res.json({
            success: true,
            message: "Dashboard data fetched successfully",
            bookings: formattedBookings,
            chargingStations,
            totalAmountThisMonth: ((_a = totalBookings[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
        });
    }
    catch (error) {
        console.log("Error in getDashboardData:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, try again later.",
        });
    }
});
exports.getDashboardData = getDashboardData;
