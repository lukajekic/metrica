const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const protect = require('../middleware/APIProtect')

router.post('/register', UserController.Register)
router.post('/login', UserController.Login)
router.get('/me', protect, UserController.getProfile)
router.post('/logout', UserController.Logout)
module.exports = router