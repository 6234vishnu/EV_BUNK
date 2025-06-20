"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const allowedOrigins = [process.env.FRONTEND_URL, PORT];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});
app.get("/", (_req, res) => {
    res.send("EV Recharge Backend with MongoDB is running ⚡");
});
app.use("/user", userRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
});
