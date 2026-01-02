const express = require('express')
const router = express.Router()
const PageController = require('../controllers/PageController')
const protect = require('../middleware/APIProtect')


router.get('/', protect, PageController.getPages)
router.get('/:id', protect, PageController.getSinglePage)
router.post('/', protect, PageController.createPage)
router.put('/', protect, PageController.editPage)
router.delete('/:id', protect, PageController.deletePage)

module.exports = router