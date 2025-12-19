const Student = require("../models/studentModel");
const Security = require("../models/guardModel");
const jwt = require("jsonwebtoken");

//Verify the user once the user redirected into gmail "verify btn" then once the page in frontend rendered then this will be triggered
exports.verifyUserAccount = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(404).json({ message: "Invalid verification link" });
    }

    jwt.verify(token, process.env.VERIFY_EMAIL_SECRET, async (err, decoded) => {
      if (err)
        return res.status(401).json({
          error: "Something went wrong while verifying email address.",
        });

      if (decoded.type !== "verify_email") {
        return res.status(403).json({ error: "Invalid token" });
      }

      const user =
        decoded.role === "Student"
          ? await Student.findById(decoded.id)
          : await Security.findById(decoded.id);
      console.log(decoded.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.isVerified = true;
      await user.save();

      res
        .status(200)
        .json({ message: "Successfully verified your email address" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
