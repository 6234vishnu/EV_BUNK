import { Request, Response } from "express";
import Bunk from "../../models/bunkSchema";

export const createBunk = async (req: Request, res: Response): Promise<any> => {
    
  try {
    const { name, address, city, contactNo, mapEmbed } = req.body;

    if (!name && !address && !city && !contactNo && !mapEmbed)
      return res
        .status(200)
        .json({
          success: false,
          message: "fill all the feilds to Create Bunk",
        });
        const bunkExists=await Bunk.findOne({mapEmbed})
        if(bunkExists) return res.status(200).json({
          success: false,
          message: "Bunk alrady exists in the  exact location try another one",
        });

        const createNewBunk=new Bunk({
            name,
            address,
            city,
            contactNo,
            mapEmbed
        })
        const saveBunk=await createNewBunk.save()

        if(!saveBunk) return res.status(200).json({
          success: false,
          message: "Couldint Create Bunk try later",
        });
        console.log('hello');
        

        return res.status(200).json({success:true,message:"Bunk Created Successfully"})

  } catch (error) {
    console.log('error in create Bunk in adminRolesController',error);
    
    return res.status(500).json({
        success: false,
        message: "Internal server error try later",
      });
  }
};
