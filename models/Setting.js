const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  degree: {
    type: String,
    enum: ['Certificate', 'Post-grad Certificate', 'Bachelors', 'Master'],
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['English', 'French'],
    required: true
  },
  educationBudget: {
    type: Number,
    default: 4000
  }
});

module.exports = mongoose.model('Setting', settingSchema);
