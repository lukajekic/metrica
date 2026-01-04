const express = require('express')
const { CheckExistingUser } = require('../controllers/CheckController')
const router = express.Router()


router.post('/existinguser', CheckExistingUser)

module.exports = router