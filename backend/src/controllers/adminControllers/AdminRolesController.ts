import { Request, Response } from "express";
import Bunk from "../../models/bunkSchema";
import Booking from "../../models/bookingModel";
import User from "../../models/userSchema";
import { startOfMonth, endOfMonth } from "date-fns";

export const createBunk = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      address,
      city,
      contactNo,
      longitude,
      latitude,
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
    } = req.body;

    if (
      !name ||
      !address ||
      !city ||
      !longitude ||
      !latitude ||
      !contactNo ||
      !mapEmbed ||
      totalPorts <= 0 ||
      !supportedConnectors ||
      supportedConnectors.length === 0
    ) {
      return res.status(200).json({
        success: false,
        message: "Missing required fields or invalid data.",
      });
    }

    const bunkExists = await Bunk.findOne({ mapEmbed });
    if (bunkExists) {
      return res.status(200).json({
        success: false,
        message: "Bunk already exists at the exact location. Try another one.",
      });
    }

    const createNewBunk = new Bunk({
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

    const saveBunk = await createNewBunk.save();

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
  } catch (error) {
    console.log("Error in createBunk in adminRolesController:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};

export const getBookings = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const getBooking = await Booking.find().sort({ createdAt: -1 });
    if (!getBooking)
      return res.status(200).json({
        success: false,
        message: "Internal server error, try again later.",
      });

    return res.status(200).json({
      success: true,
      bookings: getBooking,
    });
  } catch (error) {
    console.log("Error in createBunk in getBookings:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { bookingId, status } = req.body;

    const updateBookingStatus = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status } },
      { new: true }
    );
    if (!updateBookingStatus)
      return res.status(200).json({
        success: false,
        message: "Internal server error, try again later.",
      });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("Error in updateBookingStatus:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};

export const getBunksList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const getBunks = await Bunk.find();
    if (!getBunks)
      return res
        .status(200)
        .json({ success: false, message: "couldint get any Bunks" });
    return res.status(200).json({ success: true, bunks: getBunks });
  } catch (error) {
    console.log("Error in getBunksList:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};

export const updateBunks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
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
    } = req.body.formData;

    const bunkID = req.params.bunkId;

    const updateBunk = await Bunk.findByIdAndUpdate(
      bunkID,
      {
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
      },
      { new: true }
    );

    if (!updateBunk)
      return res
        .status(200)
        .json({ success: false, message: "couldint update Bunks" });

    return res
      .status(200)
      .json({ success: true, message: "bunk Updated SuccessFully" });
  } catch (error) {
    console.log("Error in updateBunks:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};

export const getAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { adminId } = req.query;
    const findAdmin = await User.findOne({ _id: adminId, isAdmin: true });

    if (!findAdmin)
      return res
        .status(400)
        .json({ success: false, message: "couldint find Admin" });
    res.status(200).json({ success: true, admin: findAdmin });
  } catch (error) {
    console.log("Error in getAdmin:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};

export const getDashboardData = async (
  req: Request,
  res: Response
): Promise<any> => {
  const getMonthName = (monthNumber: number): string => {
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
    const startOfCurrentMonth = startOfMonth(new Date());
    const endOfCurrentMonth = endOfMonth(new Date());

    const getBookings = Booking.aggregate([
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

    const chargingBunks = Bunk.aggregate([
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

    const totalAmountsFromBookings = Booking.aggregate([
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

    const [bookings, chargingStations, totalBookings] = await Promise.all([
      getBookings,
      chargingBunks,
      totalAmountsFromBookings,
    ]);

    const formattedBookings = bookings.map((booking: any) => ({
      month: getMonthName(booking._id),
      bookings: booking.bookings,
    }));

    return res.json({
      success: true,
      message: "Dashboard data fetched successfully",
      bookings: formattedBookings,
      chargingStations,
      totalAmountThisMonth: totalBookings[0]?.totalAmount || 0,
    });
  } catch (error) {
    console.log("Error in getDashboardData:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};
