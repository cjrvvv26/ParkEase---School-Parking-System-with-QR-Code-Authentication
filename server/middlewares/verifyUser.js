const jwt = require("jsonwebtoken");

exports.verifyUser = (cookie = "token") => {
  return (req, res, next) => {
    const token = req.cookies?.[cookie];

    if (!token) {
      return res.status(401).json({ error: "No user session" });
    }

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });

      req.user = decoded;
      next();
    });
  };
};
