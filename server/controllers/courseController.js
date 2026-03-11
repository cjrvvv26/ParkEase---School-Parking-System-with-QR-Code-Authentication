const Course = require('../models/courseModel');
const Student = require('../models/studentModel');

exports.getAllCourse = async (req, res) => {
  try {
    const course = await Course.find();

    if (course.length < 1) {
      res.status(200).json({ message: 'No courses found' });
    }

    if (course) {
      res.status(200).json({ message: 'Success' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
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
    const students = await Student.find({ courseId: id });

    if (students.length > 0) {
      return res
        .status(402)
        .json({ message: 'There are students who enrolled on this program.' });
    }

    const course = await Course.findByIdAndDelete(_id);

    if (course) {
      res.status(200).json({ message: 'Success' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
