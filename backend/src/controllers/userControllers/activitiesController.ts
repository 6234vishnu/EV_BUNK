import { Request,Response } from "express"
import Bunk from "../../models/bunkSchema"

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