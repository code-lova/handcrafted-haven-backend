import createHttpError from "http-errors";
import userService from "../services/userService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return next(createHttpError(409, "User already exists"));
    }

    // Create new user
    const newUser = await userService.createUser({ name, email, password, role });
    if (!newUser) {
      return next(createHttpError(500, "Failed to create new user"));
    }

    return res.status(201).json({ newUser, message: "User Created successfully" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(createHttpError(401, "Invalid email or password"));
    }
    if (!password) {
      return next(createHttpError(400, "Password is required"));
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    // Generate JWT
    const accessToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send response to NextAuth
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const logoutHandler = async (req, res, next) => {
   try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
}

const getUser = async (req, res, next) => {
  const userId = req.user.id;
  const existingUser = await userService.findUserById(userId);
  if (!existingUser) {
    return next(createHttpError(404, "No user found"));
  }
  try {
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


export default { registerUser, loginUser, getUser, logoutHandler };
