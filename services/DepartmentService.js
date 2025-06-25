const DepartmentModel = require('../models/Department');
const ApiError = require('../exceptions/ApiError');

class DepartmentService {
    async create(name) {
        return await DepartmentModel.create({ name });
    }

    async allDepartments() {
        return await DepartmentModel.find();
    }
}

module.exports = new DepartmentService();
