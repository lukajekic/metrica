const express = require('express')
const router = express.Router()
const EventController = require('../controllers/EventController')
const protect = require('../middleware/APIProtect')


router.post('/get', protect, EventController.getEvents)
router.get('/:id', protect, EventController.getSingleEvent)
router.post('/', protect,  EventController.createEvent)
router.put('/', protect, EventController.editEvent)
router.delete('/:id', protect, EventController.deleteEvent)

module.exports = router