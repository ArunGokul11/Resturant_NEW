
const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/userController');
const userAuthMiddleware = require('../../middleware/userAuthMiddleware')

// User routes
router.post('/register', userController.register);
router.post('/login',userController.login);
router.get('/profile',userAuthMiddleware,userController.getProfile);


module.exports = router;
