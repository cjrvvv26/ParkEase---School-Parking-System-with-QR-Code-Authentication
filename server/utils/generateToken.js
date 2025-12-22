const jwt = require("jsonwebtoken");

const generateToken = (id, role = "Super admin") => {
  let expiration = "1d";

  switch (role) {
    case "Student":
      expiration = "7d";
      break;
    case "Guard":
      expiration = "3d";
      break;
    case "Super admin":
      expiration = "1d";
  }

  return jwt.sign({ id, role }, process.env.SECRET, {
    expiresIn: expiration,
  });
};

module.exports = generateToken;
