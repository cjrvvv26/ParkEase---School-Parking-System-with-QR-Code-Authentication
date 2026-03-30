const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'super admin') => {
  let expiration = '1d';

  switch (role) {
    case 'student':
      expiration = '7d';
      break;
    case 'guard':
      expiration = '3d';
      break;
    case 'super admin':
      expiration = '1d';
  }

  return jwt.sign({ id, role }, process.env.SECRET, {
    expiresIn: expiration,
  });
};

module.exports = generateToken;
