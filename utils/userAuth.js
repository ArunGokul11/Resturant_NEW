const jwt = require('jsonwebtoken');
const { User } = require('../models');
const responseWrapper = require('./responseWrapper');

const generateToken = (userId) => {
  const tokenExpiry = process.env.JWT_EXPIRY || '1h';
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: tokenExpiry });
};

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json(responseWrapper(403, 'fail', null, 'No token provided.'));

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(500).json(responseWrapper(500, 'error', null, 'Failed to authenticate token.'));

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json(responseWrapper(404, 'fail', null, 'No user found.'));

    req.userId = user.id;
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
