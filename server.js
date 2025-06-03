import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send("Welcome to the Handcafted Heaven APP.");
});

//Auth routes
app.use("/api/auth", authRoutes); //registration and login

// Domain Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/orders", orderRoutes);

// Handle undefined routes (404)
app.use(notFound);

//Global Error Handler Middleware
app.use(errorHandler);

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
