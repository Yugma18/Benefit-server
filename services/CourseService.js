const Course = require('../models/Course');

exports.createCourse = async (courseData) => {
  return await Course.create(courseData);
};

exports.getAllCourses = async () => {
  return await Course.find();
};

exports.getAllCoursesByIdx = async (id) => {
  console.log(id);
  return await Course.find({ employerId: { $regex: id, $options: 'i' } });
  // return await Course.find({ employerId: { $in: [id] } });
};

exports.getCourseById = async (id) => {
  return await Course.findById(id);
};

exports.updateCourse = async (id, courseData) => {
  return await Course.findByIdAndUpdate(id, courseData);
};

exports.deleteCourse = async (id) => {
  return await Course.findByIdAndDelete(id);
};
