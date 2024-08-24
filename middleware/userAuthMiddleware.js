// const jwt = require('jsonwebtoken');
// const { User, UserToken } = require('../models'); // Adjust the path as needed
// const responseWrapper = require('../utils/responseWrapper');
// const { Op } = require('sequelize');

// const verifyToken = async (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(403).json(responseWrapper(403, 'fail', null, 'No token provided.'));
//   }

//   try {
//     // const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
//     // console.log('Clean Token:', cleanToken);

//     // const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
//     // console.log('Decoded Token:', decoded);

//     // const userToken = await UserToken.findOne({
//     //   where: {
//     //     userId: decoded.id,
//     //     authToken: cleanToken,
//     //     isExpired: false,
//     //     authTokenExpiry: { [Op.gt]: new Date() }
//     //   }
//     // });
//     const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
//     const userToken = await UserToken.findOne({ where: { userId: decoded.id, authToken: token.replace('Bearer ', ''), isExpired: false } });

//     console.log('UserToken Record:', userToken);

//     if (!userToken) {
//       return res.status(401).json(responseWrapper(401, 'fail', null, 'Unauthorized.'));
//     }

//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message);
//     res.status(500).json(responseWrapper(500, 'error', null, 'Failed to authenticate token.'));
//   }
// };


// module.exports = verifyToken;

const jwt = require('jsonwebtoken');
const { UserToken } = require('../models');
const responseWrapper = require('../utils/responseWrapper');
const { Op } = require('sequelize');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    console.log('No token provided'); // Debug log
    return res.status(403).json(responseWrapper(403, 'fail', null, 'No token provided.'));
  }

  try {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    console.log('Clean Token:', cleanToken); // Debug log

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug log

    const userToken = await UserToken.findOne({
      where: {
        userId: decoded.id,
        authToken: cleanToken,
        isExpired: false,
        // authTokenExpiry: { [Op.gt]: new Date() }
      }
    });

    console.log('UserToken Record:', userToken); // Debug log

    if (!userToken) {
      console.log('UserToken not found or invalid'); // Debug log
      return res.status(401).json(responseWrapper(401, 'fail', null, 'Unauthorized.'));
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Token verification error:', err); // Log the error for debugging
    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to authenticate token.'));
  }
};

module.exports = verifyToken;

