const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyUser = (cookieName = "token") => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.[cookieName];

      if (!token) {
        return res.status(401).json({ error: "No user session" });
      }

      jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ error: "Invalid or already expired token" + cookieName });
        }
        //On this early stage I must find who is the user that's trying to make a request (find in users collection)
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
};
module.exports = verifyUser;
