const EmployerModel = require("../models/Employer");

exports.getAllEmployers = async () => {
    return EmployerModel.find();
};

exports.createEmployer = async (employee) => {
    return await EmployerModel.create(employee);
};
exports.getEmployerById = async (id) => {
    return EmployerModel.findById(id);
};

exports.updateEmployer = async (id, employee) => {
    return EmployerModel.findByIdAndUpdate(id, employee);
};

exports.deleteEmployer = async (id) => {
    return EmployerModel.findByIdAndDelete(id);
};
