const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    name: { type: String, require: true },
});

module.exports = mongoose.model('Department', DepartmentSchema);
