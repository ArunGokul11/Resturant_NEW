const jwt = require('jsonwebtoken');
const { Driver } = require('../models'); // Adjust the path as needed
const responseWrapper = require('./responseWrapper'); // Adjust the path as needed

// Generate a JWT token for a driver
const generateToken = (driverId) => {
  const tokenExpiry = process.env.JWT_EXPIRY || '30d'; // Default to 30 days
  return jwt.sign({ id: driverId }, process.env.JWT_SECRET, { expiresIn: tokenExpiry });
};

// Verify JWT token middleware for driver authentication
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json(responseWrapper(403, 'fail', null, 'No token provided.'));
  }

  try {
    // Remove "Bearer " prefix if present
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify the token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // Find the driver based on the decoded token
    const driver = await Driver.findByPk(decoded.id);
    if (!driver) {
      return res.status(404).json(responseWrapper(404, 'fail', null, 'Driver not found.'));
    }

    // Attach driver ID to the request object
    req.driverId = driver.id;
    next();
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to authenticate token.'));
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
