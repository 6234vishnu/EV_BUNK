import { Request, Response } from "express";
import Bunk from "../../models/bunkSchema";
import User from "../../models/userSchema";
import Booking from "../../models/bookingModel";

export const getBunks = async (req: Request, res: Response): Promise<any> => {
  try {
    const findBunks = await Bunk.find();
    if (!findBunks)
      return res
        .status(200)
        .json({ success: false, message: "couldint find any Bunks try later" });
    return res.status(200).json({ success: true, bunks: findBunks });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error try later" });
  }
};

export const bookingBunk = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      slotTime,
      bookingDate,
      vehicleNumber,
      connectorType,
      chargingType,
      status,
      price,
    } = req.body;

    const { userId, bunkId } = req.query;

    const findUser = await User.findOne({ _id: userId, isBlocked: false });
    if (!findUser)
      return res
        .status(200)
        .json({ success: false, message: "Couldint find User" });
    const findBunk = await Bunk.findOne({ _id: bunkId, allowBooking: true });
    if (!findBunk)
      return res
        .status(200)
        .json({ success: false, message: "Couldint find Bunk" });

    if (
      !slotTime &&
      !bookingDate &&
      !vehicleNumber &&
      !connectorType &&
      !chargingType &&
      !status &&
      !price
    ) {
      return res.status(200).json({
        success: false,
        message: "fill all the details before submission",
      });
    }

    const newBooking = new Booking({
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

    const saveBooking = await newBooking.save();
    if (!saveBooking)
      return res
        .status(200)
        .json({ success: false, message: "Internal server error try later" });

    return res
      .status(200)
      .json({ success: true, message: "Booking SuccessFull" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error try later" });
  }
};

export const bookingLists = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    const getBookings = await Booking.find({ user: userId });
    if (!getBookings)
      return res
        .status(200)
        .json({ success: false, message: "couldint get any past bookings" });
    return res.status(200).json({ success: true, bookings: getBookings });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error try later" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.query;
    const findUser = await User.findById(userId).sort({ createdAt: -1 });
    if (!findUser)
      return res
        .status(200)
        .json({ success: false, message: "couldint find user details" });
    return res.status(200).json({ success: true, user: findUser });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error try later" });
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const cancelBookingId = req.params.id;
    const updateBooking = await Booking.findByIdAndUpdate(
      cancelBookingId,
      { $set: { status: "Cancelled" } },
      { new: true }
    );
    if (!updateBooking)
      return res
        .status(200)
        .json({ success: false, message: "couldint cancel Booking" });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error try later" });
  }
};

export const getUserAuthenticate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    const finduser = await User.findById(userId);
    if (!finduser)
      return res
        .status(200)
        .json({ success: false, message: "couldint find User" });
    res.status(200).json({ success: true, user: finduser });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};
export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    const finduser = await User.findById(userId);
    if (!finduser)
      return res
        .status(200)
        .json({ success: false, message: "Could not find user" });

    const { name, email, phone } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, email, phone } },
      { new: true }
    );

    if (!updateUser) {
      return res
        .status(200)
        .json({ success: false, message: "Could not update user. Try later." });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};
