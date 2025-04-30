import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  bunk: mongoose.Types.ObjectId;
  slotTime: string; // e.g., "10:30 AM - 11:30 AM"
  bookingDate: Date;
  vehicleNumber: string;
  connectorType: string;
  chargingType: "AC" | "DC";
  status: "Booked" | "Cancelled" | "Completed";
  price: number;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bunk: {
      type: Schema.Types.ObjectId,
      ref: "Bunk",
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    connectorType: {
      type: String,
      required: true,
    },
    chargingType: {
      type: String,
      enum: ["AC", "DC"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked",
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
