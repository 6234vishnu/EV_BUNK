import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import cors from "cors";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT =  5000;

app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [process.env.FRONTEND_URL];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.get("/", (_req, res) => {
  res.send("EV Recharge Backend with MongoDB is running ⚡");
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
});
