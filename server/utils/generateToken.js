const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  let expiration = "1d";

  switch (role) {
    case "student":
      expiration = "7d";
      break;
    case "security":
      expiration = "3d";
      break;
    default:
      expiration = "1d";
  }

  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: expiration,
  });
};

module.exports = generateToken;
