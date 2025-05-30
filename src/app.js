import chalk from "chalk";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { nodeEnv, port } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import bookRouter from "./routes/bookRoute.js";

// Initializing the app
const app = express();
app.use(cookieParser());

// Essential security headers with Helmet
app.use(helmet());

// Enable CORS with default settings
app.use(cors());

// Logger middleware for development environment
if (nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Compress all routes
app.use(compression());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Built-in middleware for parsing JSON
app.use(express.json());

// Use authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(chalk.red(err.stack));
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: {},
  });
});

// Database connection
connectDB();

// Server running
app.listen(port, () => {
  console.log(`${chalk.green.bold("Server")} is listening on port ${port}`);
});
