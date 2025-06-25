const UserService = require('../services/UserService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/ApiError');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('validation error', errors.array())
                );
            }
            const { firstName, lastName, email, password, roles, companyId } =
                req.body;
            const user = await UserService.registration({
                firstName,
                lastName,
                email,
                password,
                roles,
                companyId,
            });
            console.log(user);
            if (user.refreshToken) {
                console.log('work');
                res.cookie('refreshToken', user.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
                    httpOnly: true,
                });
            }
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await UserService.login(email, password);
            if (user.refreshToken) {
                res.cookie('refreshToken', user.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
                    httpOnly: true,
                });
            }
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const { code, id } = req.query;
            const user = await UserService.activate(code, id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async resendActivate(req, res, next) {
        try {
            const { id } = req.query;
            const user = await UserService.resendActivateCode(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { id, password, newPassword } = req.body;
            const user = await UserService.changePassword(id, password, newPassword);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async resendConfirmAuthCode(req, res, next) {
        try {
            const { id } = req.query;
            const user = await UserService.resendConfirmAuthCode(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async confirmAuth(req, res, next) {
        try {
            const { code, id } = req.query;
            const user = await UserService.confirmAuth(code, id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const user = await UserService.refresh(refreshToken);
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
            const currentUser = await UserService.getCurrentUser(user.id)
            return res.json(currentUser);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.delete(id);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await UserService.updateUser(req.body);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
