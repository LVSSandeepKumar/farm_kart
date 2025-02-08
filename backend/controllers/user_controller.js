import bcrypt from "bcryptjs";

import prisma from "../prisma/index.js";
import logger from "../utils/logger.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  try {
    const { name, phone, email, password, role, userName } = req.body;

    if (!name || !phone || !password) {
      logger.error("All fields are not provided");
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      logger.error("Invalid email format");
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });
    if (existingUser) {
      logger.error("User already exists with this phone number");
      return res
        .status(400)
        .json({ error: "User already exists with this phone number" });
    }

    if (password.length < 6) {
      logger.error("Password should be atleast 6 characters long");
      return res
        .status(400)
        .json({ error: "Password should be atleast 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        userName,
        userStatus: "unauthorized",
        role: role || "user",
      },
    });

    generateTokenAndSetCookie(user._id, res);

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", error });
    logger.error("Error in signup controller", error);
  }
};

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            logger.error("All fields are not provided");
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await prisma.user.findUnique({
            where: {
                phone,
            },
        });
        if (!user) {
            logger.error("User not found");
            return res.status(404).json({ error: "User not found, Please signup first" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.error("Invalid credentials");
            return res.status(401).json({ error: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        logger.error("Error in login controller", error);
        res.status(500).json({ error: "Internal Server Error", error });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        logger.error("Error in logout controller", error);
        res.status(500).json({ error: "Internal Server Error", error });
    }    
}