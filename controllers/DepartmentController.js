const DepartmentService = require('../services/DepartmentService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/ApiError');

class DepartmentController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            const department = await DepartmentService.create(name);
            return res.json(department);
        } catch (e) {
            next(e);
        }
    }

    async allDepartments(req, res, next) {
        try {
            const departments = await DepartmentService.allDepartments();
            return res.json(departments);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new DepartmentController();
