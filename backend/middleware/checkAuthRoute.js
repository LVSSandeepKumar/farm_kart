import jwt from "jsonwebtoken";
import prisma from "../prisma/index.js";
import logger from "../utils/logger.js";

const checkAuthRoute = async (req, res, next) => {
  try {
    //Check if the user has a token in their request cookies and fetch it
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ error: "Unauthorized: No token provided" });
    }
    //Decode the token with JWT_SECRET we have
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ error: "Unauthorized: Invalid token provided" });
    }
    //Check for the user with the userId for which the token is assigned
    const user = await prisma.user.findUnique(
      {
        where: {
          id: decoded.userId,
        }
      }
    )
    if (!user) {
      return res.staus(404).json({ error: "User not found" });
    }
    // Exclude password to make sure it is safe user data
    const safeUser = { ...user, password: undefined };
    //Set the request user as our database user for better accessibility throughout the client-side application
    req.user = safeUser;
    next();
  } catch (error) {
    //Error handling
    console.log(`Error in checkAuthRoute Middleware, ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};

export default checkAuthRoute;