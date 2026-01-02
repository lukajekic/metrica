const express = require('express')
const { registerEventTrigger } = require('../controllers/EventTriggerController')
const router = express.Router()


router.post('/track', registerEventTrigger) //ne treba api protect jer 
// dodavanje analitike se radi sa stranog origina 
// (sve osim Metrica Cloud) i autentifikacija bez 
// unosa podataka je teska, a malo lazne analitike 
// nije desturktivno, sititi READ operacije sa dashboarda 
// i izmena konfiguracije (sve osim PageView i EventTrigger)
// api key u headeru sluzi vise kao identifikator



module.exports = router