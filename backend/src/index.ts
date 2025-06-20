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



const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS"
};

app.use(cors(corsOptions));


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
