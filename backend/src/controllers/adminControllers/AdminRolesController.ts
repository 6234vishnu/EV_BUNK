import { Request, Response } from "express";
import Bunk from "../../models/bunkSchema";
import { v2 as cloudinary } from 'cloudinary';


export const createBunk = async (req: Request, res: Response): Promise<any> => {
 
  try {

   
    const { name, address, city, contactNo, mapEmbed, totalPorts, availablePorts, chargingType, supportedConnectors, pricePerKWh, flatRate, is24Hours, status, allowBooking } = req.body;


    if (!name || !address || !city || !contactNo || !mapEmbed || totalPorts <= 0 || !supportedConnectors || supportedConnectors.length === 0) {
      return res.status(200).json({ success: false, message: "Missing required fields or invalid data." });
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
      allowBooking
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
    console.log('Error in createBunk in adminRolesController:', error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error, try again later.",
    });
  }
};