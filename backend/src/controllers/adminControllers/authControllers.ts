import { Request, Response } from "express";
import Admin from "../../models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import hashPassword from "../../utils/passwordHash";

export const loginController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  try {
    const { email, password } = req.body;
    const findAdmin = await Admin.findOne({ email, isAdmin: true });
    if (!findAdmin || !findAdmin.password)
      return res
        .status(200)
        .json({ success: false, message: "Admin not found " });

    const registeredPassword = findAdmin.password;

    const checkPassword = await bcrypt.compare(password, registeredPassword);

    if (!checkPassword)
      return res
        .status(200)
        .json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { userId: findAdmin._id, email: findAdmin.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, adminId: findAdmin._id });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPasswordSendOtp = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const findAdmin = await Admin.findOne({ email, isAdmin: true });
    if (!findAdmin)
      return res
        .status(200)
        .json({ success: false, message: "Admin not found " });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    return res.status(200).json({ success: true, otp });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const setNewPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  try {
    const { email, password } = req.body;
    const findAdmin = await Admin.findOne({ email, isAdmin: true });
    if (!findAdmin)
      return res
        .status(200)
        .json({ success: false, message: "Admin not found " });
    const hashNewPassword = await hashPassword(password);
    if (!hashNewPassword)
      return res.status(200).json({ success: false, message: "Server error " });
    const updateAdminPassword = await Admin.findByIdAndUpdate(
      findAdmin?._id,
      { $set: { password: hashNewPassword } },
      { new: true }
    );
    if (!updateAdminPassword)
      return res
        .status(200)
        .json({ success: false, message: "Couldint update password" });
    const token = jwt.sign(
      { userId: findAdmin._id, email: findAdmin.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(200)
      .json({ success: true, adminId: updateAdminPassword._id });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminLogout = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { adminId } = req.query;
    const findAdmin = await Admin.findById(adminId);
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
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
