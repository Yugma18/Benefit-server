// models/course.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  course_name: {
    type: String,
    required: true
  },
  degree_type: {
    type: String,
    enum: ['Certificate', 'Post-grad Certificate', 'Bachelors', 'Master'],
    required: true
  },
  interest: [String], // Assuming multiple interests can be selected
  institution: {
    type: String
  },
  language: {
    type: String,
    enum: ['English', 'French'],
    required: true
  },
  delivery: {
    type: String
  },
  location: {
    type: String
  },
  duration: {
    type: String
  },
  cost: {
    type: Number
  },
  link: {
    type: String
  },
  target: {
    type: String
  },
  logo: {
    type: String
  },
  employerId: {
    type: String,
    required: true
  },
  bgImage: {
    type: String
  },
  about: {
    type: String,
    default: '',
    trim: true
  },
  overview: {
    type: String,
    default: '',
    trim: true
  },
  application_deadline: {
    type: String
  },
  start_date: {
      type: Date,
      default: Date.now,
  },
  tuition_and_fees: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
      type: Date,
      default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
