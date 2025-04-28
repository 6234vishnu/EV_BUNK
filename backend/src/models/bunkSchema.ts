import mongoose, { Schema, Document } from 'mongoose';


interface IBunk extends Document {
  name: string;
  address: string;
  city: string;
  contactNo: string;
  mapEmbed: string;
}


const bunkSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    mapEmbed: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create and export the Bunk model
const Bunk = mongoose.model<IBunk>('Bunk', bunkSchema);

export default Bunk;
