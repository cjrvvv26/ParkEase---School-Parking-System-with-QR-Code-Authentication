const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourse);
router.post('/add', courseController.createCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
