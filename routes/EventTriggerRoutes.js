const express = require('express')
const { registerEventTrigger, getEventTriggers } = require('../controllers/EventTriggerController')
const protect = require('../middleware/APIProtect')
const router = express.Router()


router.post('/track', registerEventTrigger) //ne treba api protect jer 
// dodavanje analitike se radi sa stranog origina 
// (sve osim Metrica Cloud) i autentifikacija bez 
// unosa podataka je teska, a malo lazne analitike 
// nije desturktivno, sititi READ operacije sa dashboarda 
// i izmena konfiguracije (sve osim PageView i EventTrigger)
// api key u headeru sluzi vise kao identifikator
router.get('/data', protect, getEventTriggers)



module.exports = router