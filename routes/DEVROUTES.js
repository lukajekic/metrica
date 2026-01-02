const express = require('express')
const { getCountryCodeDEV } = require('../controllers/DEVCONTROLLER')
const router = express.Router()

router.get('/countrycode', getCountryCodeDEV)
module.exports = router