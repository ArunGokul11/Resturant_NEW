const bcrypt = require('bcrypt');
const { User, UserToken } = require('../../models');
const { generateToken } = require('../../utils/userAuth');
const responseWrapper = require('../../utils/responseWrapper');
const { Op } = require('sequelize'); // Import Op


// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = await User.create({ username, email, password: hashedPassword });

    // Generate a token for the newly registered user
    const token = generateToken(user.id);
    console.log('Generated Token:', token); // Debugging line

    // Optionally store the token in the UserToken model
    await UserToken.create({
      userId: user.id,
      authToken: token,
      authTokenExpiry: new Date(Date.now() + 3600000) // Token expiry set to 1 hour
    });

    // Respond with the user and token
    res.json(responseWrapper(200, 'success', { user, token }, 'Registration successful'));
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json(responseWrapper(500, 'error', null, 'Registration failed'));
  }
};
// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json(responseWrapper(400, 'fail', null, 'Invalid email or password'));
    }

    // Invalidate all previous tokens
    await UserToken.update(
      { isExpired: true },
      {
        where: {
          userId: user.id,
          isExpired: false, // Only update tokens that are not expired
          authTokenExpiry: { [Op.gt]: new Date() }, // Only update tokens that are not expired by date
        },
      }
    );

    // Generate a new token
    const token = generateToken(user.id);
    console.log('Generated Token:', token); // Debugging line
    const MAX_ACTIVE_TOKENS = process.env.MAX_ACTIVE_TOKENS || 1;
 
    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    // // Store the new token
    await UserToken.create({
      userId: user.id,
      authToken: token,
      authTokenExpiry: new Date(Date.now() + thirtyDaysInMilliseconds), // Token expiry set to 1 hour
    });

    res.json(responseWrapper(200, 'success', { token }, 'Login successful'));
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json(responseWrapper(500, 'error', null, 'Login failed'));
  }
};


// Get profiles
exports.getProfile = async (req, res) => {
  try {
    const userProfiles = await User.findAll();
    res.json(responseWrapper(200, 'success', userProfiles, 'User profiles fetched successfully.'));
  } catch (error) {
    res.status(500).json(responseWrapper(500, 'error', null, 'Failed to fetch user profiles.'));
  }
};



