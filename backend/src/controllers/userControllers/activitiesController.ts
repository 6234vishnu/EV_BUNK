import { Request,Response } from "express"
import Bunk from "../../models/bunkSchema"
import User from '../../models/userSchema'
import Booking from '../../models/bookingModel'

export const getBunks=async(req:Request,res:Response):Promise<any>=>{
    try {
        const findBunks=await Bunk.find()
        if(!findBunks) return res.status(200).json({success:false,message:"couldint find any Bunks try later"})
            return res.status(200).json({success:true,bunks:findBunks})
    } catch (error) {
        console.log('error in get Bunks in user side activities controller',error);
        return res.status(200).json({success:false,message:"Internal server error try later"})
        
    }
}

export const bookingBunk=async(req:Request,res:Response):Promise<any>=>{
 
    try {
        const {slotTime,
            bookingDate,
            vehicleNumber,
            connectorType,
            chargingType,
            status,
            price,}=req.body

            

            const { userId, bunkId } = req.query;

        const findUser=await User.findOne({_id:userId,isBlocked:false})
           if(!findUser) return res.status(200).json({success:false,message:"Couldint find User"})
        const findBunk=await Bunk.findOne({_id:bunkId,allowBooking:true})
           if(!findBunk) return res.status(200).json({success:false,message:"Couldint find Bunk"})

            if(!slotTime&&!bookingDate&&!vehicleNumber&&!connectorType&&!chargingType&&!status&&!price){
                return res.status(200).json({success:false,message:"fill all the details before submission"})
            }
        
            const newBooking=new Booking({
                user:findUser._id,
                bunk:findBunk._id,
                slotTime,
            bookingDate,
            vehicleNumber,
            connectorType,
            chargingType,
            status,
            price,
            })

            const saveBooking=await newBooking.save()
            if(!saveBooking) return res.status(200).json({success:false,message:"Internal server error try later"})


            return res.status(200).json({success:true,message:"Booking SuccessFull"})

    } catch (error) {
        console.log('error in bookingBunk in user side activities controller',error);
        return res.status(200).json({success:false,message:"Internal server error try later"})
    }
}
