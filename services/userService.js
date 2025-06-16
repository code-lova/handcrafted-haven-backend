import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Register a new user
const createUser = async ({ name, email, password, role }) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return await User.create(newUser);
};

//Update a user by id and it body
const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};


// Find a user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find user by id
const findUserById = async (id) => {
  return await User.findById(id);
};

// Get user by ID
const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

export default { createUser, updateUser, findUserByEmail, findUserById, getUserById };
