const courseService = require('../services/CourseService');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCoursesByIdx = async (req, res) => {
  try {
    const courses = await courseService.getAllCoursesByIdx(
      req.user.id
    )
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
