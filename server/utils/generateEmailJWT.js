const jwt = require("jsonwebtoken");

const generateEmailJWT = (id, role = "Student") => {
  return jwt.sign(
    { id, role, type: "verify_email" },
    process.env.VERIFY_EMAIL_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

module.exports = generateEmailJWT;
