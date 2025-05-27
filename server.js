import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send("Welcome to the Handcafted Heaven APP.");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
