import { Request, Response } from 'express';
import User from '../../models/userSchema'
import { sendOtp } from '../../utils/sendOtp';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
 
  
    const {fullName,phone, email, password,confirmPassword } = req.body.formdata;

    if(!fullName && !phone && !email &&!password &&!confirmPassword){

      res.status(200).json({success:false, message: 'fill all the feilds' });
    }
    if(password!==confirmPassword){
      res.status(200).json({success:false, message: 'passwords are not matched' });
    }
    const userExist=await User.findOne({email:email})
    if(userExist){
      res.status(200).json({success:false, message: 'User already exists ' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    const success = await sendOtp(email,otp)
    if(!success){
      res.status(200).json({success:false, message: 'Server Error ' });
    }
    res.status(200).json({success:true,otp})

  } catch (error) {
    res.status(500).json({ success:false, message: 'Internal Server Error' });
  }
};
