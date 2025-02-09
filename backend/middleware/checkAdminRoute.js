import jwt from "jsonwebtoken";
import prisma from "../prisma/index.js";
import logger from "../utils/logger.js";

const checkAdminRoute = async (req, res, next) => {
  try {
    //Check if the user has a token in their request cookies and fetch it
    const token = req.cookies.jwt;
    if (!token) {
      logger.error("Unauthorized: No token provided");
      return res.status(400).json({ error: "Unauthorized: No token provided" });
    }
    //Decode the token with JWT_SECRET we have
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`decoded token: ${JSON.stringify(decoded)}`);
    if (!decoded) {
      logger.error("Unauthorized: Invalid token provided");
      return res
        .status(400)
        .json({ error: "Unauthorized: Invalid token provided" });
    }
     // ✅ FIXED: Ensure correct token structure
     if (!decoded.user || !decoded.user.id) {
      logger.error("Invalid token format: Missing user ID");
      return res.status(400).json({ error: "Invalid token format" });
    }
    //Check for the user with the userId for which the token is assigned
    const user = await prisma.user.findUnique({ 
      where: {
        id: decoded.user.id,
      }
    });
    if (!user) {
      logger.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    // Exclude password to make sure it is safe user data
    const safeUser = { ...user, password: undefined };
    //Set the request user as our database user for better accessibility throughout the client-side application
    req.user = safeUser;
    if (safeUser.role !== "admin") {
      logger.error("Unauthorized: Admin access required");
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }
    next();
  } catch (error) {
    //Error handling
    console.log(`Error in checkAdminRoute Middleware, ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};

export default checkAdminRoute; 