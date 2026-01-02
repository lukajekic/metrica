const express = require('express')

const router = express.Router()
const licensecontroller = require('../controllers/LicenseController')
const protect = require('../middleware/APIProtect')
router.get('/check', protect, licensecontroller.checkValidty)
router.post('/create', protect, licensecontroller.createLicense)

module.exports = router