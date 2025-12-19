const jwt = require("jsonwebtoken");

const verifyUser = (cookieName = "token") => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.[cookieName];

      if (!token) {
        return res.status(401).json({ error: "No user session" });
      }

      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ error: "Invalid or already expired token" });
        }

        req.id = decoded.id;
        next();
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
};

module.exports = verifyUser;
