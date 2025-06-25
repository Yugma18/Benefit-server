const EmployeeService = require('../services/EmployeeService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/ApiError');

class EmployeeController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('validation error', errors.array())
                );
            }
            const user = await EmployeeService.registration(req.body);
            // res.cookie('refreshToken', user.refreshToken, {
            //     maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
            //     httpOnly: true,
            // });
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await EmployeeService.login(email, password);
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
                httpOnly: true,
            });
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await EmployeeService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const { code, id } = req.query;
            const user = await EmployeeService.activate(code, id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async resendActivate(req, res, next) {
        try {
            const { id } = req.query;
            const user = await EmployeeService.resendActivateCode(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { id, password, newPassword } = req.body;
            const user = await EmployeeService.changePassword(
                id,
                password,
                newPassword
            );
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async resendConfirmAuthCode(req, res, next) {
        try {
            const { id } = req.query;
            const user = await EmployeeService.resendConfirmAuthCode(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async confirmAuth(req, res, next) {
        try {
            const { code, id } = req.query;
            const user = await EmployeeService.confirmAuth(code, id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await EmployeeService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const user = await EmployeeService.refresh(refreshToken);
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
                httpOnly: true,
            });
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const { user } = req;
            const currentUser = await EmployeeService.getCurrentUser(user.id);
            return res.json(currentUser);
        } catch (e) {
            next(e);
        }
    }

    async getByIdx(req, res, next) {
        try {
            const employees = await EmployeeService.getEmployeesByIdx(
                req.user.id
            );
            return res.json(employees);
        } catch (e) {
            next(e);
        }
    }

    async getEmployeesByCompany(req, res, next) {
        try {
            const { companyId } = req.params;
            const employees = await EmployeeService.getEmployeesByCompany(
                companyId
            );
            return res.json(employees);
        } catch (e) {
            next(e);
        }
    }

    async getEmployeeById(req, res, next) {
        try {
            const { id } = req.params;
            const employees = await EmployeeService.getEmployeeById(id);
            return res.json(employees);
        } catch (e) {
            next(e);
        }
    }

    async getEmployeesById(req, res, next) {
        try {
            const { id } = req.params;
            const employees = await EmployeeService.getEmployeesById(id);
            return res.json(employees);
        } catch (e) {
            next(e);
        }
    }

    async updateEmployee(req, res, next) {
        try {
            const employees = await EmployeeService.updateEmployee(req.body);
            return res.json(employees);
        } catch (e) {
            next(e);
        }
    }

    async deleteEmployee(req, res, next) {
        try {
            const { id } = req.params;
            const employee = await EmployeeService.deleteEmployee(id);
            return res.json(employee);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new EmployeeController();
