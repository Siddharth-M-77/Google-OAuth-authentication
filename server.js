// server.js
import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import session from "express-session";
import connectDB from "./connection/DB.js";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import "./config/passportConfig.js"; // Make sure this is imported to initialize the strategy

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Configure express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` in production
  })
);

// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allows cookies and credentials to be sent
};

// Use CORS middleware with options
app.use(cors(corsOptions));
// Routes
app.use("/api/v1/auth", authRoute);

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    console.log("MongoDB Connected...");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
