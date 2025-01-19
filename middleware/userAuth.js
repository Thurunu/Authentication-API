import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(403).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const tokenDecode = JWT.verify(token, process.env.JWT_SECRET);

    if (tokenDecode && tokenDecode.id) {
      req.body.userId = tokenDecode.id;
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.json({ success: false, message: "Invalid token. Login Again." });
    }
  } catch (error) {
    return res.json({ success: false, message: "Token verification failed. " + error.message });
  }
};

export default userAuth;
