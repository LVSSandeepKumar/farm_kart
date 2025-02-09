export const checkAdminRoute = async (req, res, next) => {
  try {
    //Check if the user has a token in their request cookies and fetch it
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ error: "Unauthorized: No token provided" });
    }
    //Decode the token with JWT_SECRET we have
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(400)
        .json({ error: "Unauthorized: Invalid token provided" });
    }
    //Check for the user with the userId for which the token is assigned
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //Set the request user as our database user for better accessibility throughout the client-side application
    req.user = user;
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }
    next();
  } catch (error) {
    //Error handling
    console.log(`Error in protectRoute Middleware, ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};
