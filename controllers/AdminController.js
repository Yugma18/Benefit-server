const AdminService = require('../services/AdminService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/ApiError');
const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
// import fs from 'fs';
// import csv from 'csv-parser';
// import { MongoClient } from 'mongodb';

class AdminController {
   
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('validation error', errors.array())
                );
            }
            const { firstName, lastName, email, password, roles } = req.body;
            const user = await AdminService.registration({
                firstName,
                lastName,
                email,
                password,
                roles,
            });
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

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await AdminService.login(email, password);
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
            const users = await AdminService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const { code, id } = req.query;
            const user = await AdminService.activate(code, id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async resendActivate(req, res, next) {
        try {
            const { id } = req.query;
            const user = await AdminService.resendActivateCode(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async resendConfirmAuthCode(req, res, next) {
        try {
            const { id } = req.query;
            const user = await AdminService.resendConfirmAuthCode(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async confirmAuth(req, res, next) {
        try {
            const { code, id } = req.query;
            const user = await AdminService.confirmAuth(code, id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await AdminService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const user = await AdminService.refresh(refreshToken);
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
            const currentUser = await AdminService.getCurrentUser(user.id);
            return res.json(currentUser);
        } catch (e) {
            next(e);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const currentUser = await AdminService.getById(id);
            return res.json(currentUser);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AdminController();
