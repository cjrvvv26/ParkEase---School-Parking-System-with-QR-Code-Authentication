const User = require("../models/userModel");
const mongoose = require("mongoose");

const requiredSuperAdmin = async (req, res, next) => {
  const { id, role } = req.user;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(401).json({ error: "Invalid Object ID" });
  }

  if (role !== "super admin") {
    return res
      .status(403)
      .json({ error: "You have no authority for this action." });
  }

  try {
    const superAdmin = await User.findById(id);
    if (!superAdmin) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = superAdmin;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = requiredSuperAdmin;
