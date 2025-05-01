import mongoose, { Schema, Document } from 'mongoose';

export interface IBunk extends Document {
  name: string;
  address: string;
  city: string;
  contactNo: string;
  mapEmbed: string;
  totalPorts: number;
  availablePorts: number;
  chargingType: string;
  supportedConnectors: string[];
  pricePerKWh: number;
  flatRate?: number;
  is24Hours: boolean;
  status: 'active' | 'maintenance' | 'inactive';
  allowBooking: boolean;
  landmarks: string[];
  latitude: number;
  longitude: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const bunkSchema: Schema<IBunk> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    contactNo: { type: String, required: true, trim: true },
    mapEmbed: { type: String, required: true, trim: true },
    totalPorts: { type: Number, required: true },
    availablePorts: { type: Number, required: true },
    chargingType: { type: String, required: true, trim: true },
    supportedConnectors: [{ type: String, required: true, trim: true }],
    pricePerKWh: { type: Number, required: true },
    flatRate: { type: Number },
    is24Hours: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active',
    },
    allowBooking: { type: Boolean, default: false },
    landmarks: [{ type: String }],
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  {
    timestamps: true,
  }
);

// Add geospatial index
bunkSchema.index({ location: '2dsphere' });

const Bunk = mongoose.model<IBunk>('Bunk', bunkSchema);

export default Bunk;
