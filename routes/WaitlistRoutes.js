const express = require('express')
const { Subscribe, GetWaitlist, Onboarding, getSingleInvitation } = require('../controllers/WaitlistController')
const protect = require('../middleware/APIProtect')
const router = express.Router()
router.get('/', protect, GetWaitlist)
router.post('/subscribe', Subscribe)
router.post('/onboarding', Onboarding)
router.post('/single/get', getSingleInvitation)
module.exports = router