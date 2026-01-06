const ProjectsController = require("../controllers/ProjectController");

const express = require('express');
const protect = require("../middleware/APIProtect");
const router = express.Router()

router.post('/get', protect, ProjectsController.getProjects)
router.post('/', protect, ProjectsController.createProject)
router.put('/', protect, ProjectsController.updateProject)
router.delete('/:id', protect, ProjectsController.deleteProject)
module.exports = router