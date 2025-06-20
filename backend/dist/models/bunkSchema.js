"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bunkSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
// Add geospatial index
bunkSchema.index({ location: '2dsphere' });
const Bunk = mongoose_1.default.model('Bunk', bunkSchema);
exports.default = Bunk;
