const jwt = require("jsonwebtoken");

const verifyUser = (cookie = "token") => {
  return (req, res, next) => {
    const authHeader = req.headers?.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = bearerToken || req.cookies?.[cookie];

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });

      req.user = decoded;
      next();
    });
  };
};

module.exports = verifyUser;
