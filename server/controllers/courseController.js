const Course = require('../models/courseModel');
const Student = require('../models/studentModel');

exports.getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find();

    if (courses.length < 1) {
      res.status(404).json({ message: 'No courses found' });
    }

    if (courses) {
      res.status(200).json({ message: 'Success', courses });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const record = await Course.findOne({
      $or: [{ name }, { description }],
    });

    if (record) {
      return res.status(403).json({ message: 'This course already exists' });
    }

    const course = await Course.create({ name, description });

    if (course) {
      res.status(200).json({ message: 'Success' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const courses = await Course.find().sort({ createdAt: -1 });

    res.json({
      message: 'Course deleted successfully',
      courses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
