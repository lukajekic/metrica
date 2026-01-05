const express = require('express')
const { Subscribe, GetWaitlist } = require('../controllers/WaitlistController')
const protect = require('../middleware/APIProtect')
const router = express.Router()
router.get('/', protect, GetWaitlist)
router.post('/subscribe', Subscribe)

module.exports = router