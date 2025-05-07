import { Request, Response } from "express";
import User from "../../models/userSchema";
import { sendOtp } from "../../utils/sendOtp";
import hashPassword from "../../utils/passwordHash";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const userLogin = async (req: Request, res: Response): Promise<any> => {
  const JWT_SECRET = process.env.JWT_SECRET as string;

  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser || !findUser.password) {
      return res
        .status(200)
        .json({ success: false, message: "User not found " });
    }

    const registeredPassword = findUser.password;

    const checkPassword = await bcrypt.compare(password, registeredPassword);

    if (!checkPassword) {
      return res
        .status(200)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: findUser._id, email: findUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ success: true, userId: findUser._id });
  } catch (error) {
    console.log("error in userLogin in userside", error);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const signUpController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, phone, email, password, confirmPassword } =
      req.body.formdata;

    if (!fullName && !phone && !email && !password && !confirmPassword) {
      res.status(200).json({ success: false, message: "fill all the feilds" });
    }
    if (password !== confirmPassword) {
      res
        .status(200)
        .json({ success: false, message: "passwords are not matched" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      res.status(200).json({ success: false, message: "User already exists " });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    const success = await sendOtp(email, otp);
    if (!success) {
      res.status(200).json({ success: false, message: "Server Error " });
    }
    console.log("otp: ", otp);

    res.status(200).json({ success: true, otp });
  } catch (error) {
    console.log("error in signUp controller in userside", error);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const JWT_SECRET = process.env.JWT_SECRET as string;

  try {
    const { enterdOtp, otpFromBackend, ...formdata } = req.body;

    const findUser = await User.findOne({ email: formdata.email });
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

    const passwordHash = await hashPassword(formdata.password);
    if (!passwordHash) {
      return res
        .status(200)
        .json({ success: false, message: "Server error, try later" });
    }

    const newUser = new User({
      name: formdata.fullName,
      email: formdata.email,
      phone: formdata.phone,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      return res
        .status(200)
        .json({ success: false, message: "Couldn’t sign up, try again later" });
    }

    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ success: true, userId: savedUser._id });
  } catch (error) {
    console.log("Error in createUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const setOtpForgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res
        .status(200)
        .json({ success: false, message: "Couldint find user in this email" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    console.log("otp: ", otp);

    return res.status(200).json({ success: true, otp });
  } catch (error) {
    console.log("Error in setOtpForgotPassword:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const ResetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  try {
    const { newPassword, email } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser)
      return res
        .status(200)
        .json({ success: false, message: "Couldint find user in this email" });
    const passwordHash = await hashPassword(newPassword);
    if (!passwordHash)
      return res
        .status(200)
        .json({ success: false, message: "Server error try later" });
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      { $set: { password: passwordHash } },
      { new: true }
    );
    if (!updateUser)
      return res
        .status(200)
        .json({ success: false, message: "Server error try later" });

    const token = jwt.sign(
      { userId: findUser._id, email: findUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ success: true, userId: findUser._id });
  } catch (error) {
    console.log("Error in ResetPassword:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const userLogout = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.query;
    const findUser = await User.findById(userId);
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
  } catch (error) {
    console.log("error in userLogout admin side");

    res.status(500).json({ message: "Internal Server Error" });
  }
};
