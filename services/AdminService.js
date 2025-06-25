const bcrypt = require('bcrypt');
const AdminSchema = require('../models/Admin');
const MailService = require('./MailService');
const TokenService = require('./TokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../exceptions/ApiError');

class UserService {
    async registration(userData) {
        const { firstName, lastName, email, password, roles } = userData;
        const candidate = await AdminSchema.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest('user is exist');
        }
        const hashPassword = await bcrypt.hash(password, 3);
        // const code = await this.generateCode();
        const code = Number(process.env.TEST_ACTIVATION_CODE); // for testing
        const user = await AdminSchema.create({
            email,
            password: hashPassword,
            firstName,
            lastName,
            roles,
            activationNumber: code,
        });
        // await MailService.sendActivationMail(email, code);
        const userDto = new UserDto(user);
        // const tokens = await TokenService.generateTokens({ ...userDto });
        // await TokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            // ...tokens,
            user: userDto,
        };
    }

    async login(email, password) {
        const user = await AdminSchema.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('User does not exist');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password');
        }
        const confirmAuthCode = await this.generateCode();
        user.confirmAuthNumber = confirmAuthCode;
        await user.save();
        // send confirmAuthCode here
        const userDto = new UserDto(user);
        if (user.isActivated && user.confirmAuthStatus) {
            user.confirmAuthStatus = false;
            await user.save();
            const tokens = await TokenService.generateTokens({ ...userDto });
            await TokenService.saveToken(userDto.id, tokens.refreshToken);
            return {
                ...tokens,
                user: userDto,
            };
        } else {
            if (!user.isActivated) {
                const activationNumber = await this.generateCode();
                user.activationNumber = activationNumber;
                await user.save();
                MailService.sendActivationMail(
                    user?.email,
                    `your code: ${activationNumber}`
                );
            } else {
                MailService.sendActivationMail(
                    user?.email,
                    `your code: ${confirmAuthCode}`
                );
            }
            return {
                user: userDto,
            };
        }
    }

    async logout(refreshToken) {
        return await TokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = await TokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }
        const user = await AdminSchema.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        };
    }

    async generateCode() {
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += Math.floor(Math.random() * 10);
        }
        return code;
    }

    async activate(code, userId) {
        const user = await AdminSchema.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('user is not exist');
        }
        if (user.isActivated) {
            throw ApiError.BadRequest('user already activated');
        }
        if (user.activationNumber !== Number(code)) {
            throw ApiError.BadRequest('code is invalid');
        }
        user.activationNumber = null;
        user.isActivated = true;
        user.confirmAuthNumber = null;
        user.confirmAuthStatus = true;
        return await user.save();
    }

    async resendActivateCode(userId) {
        const user = await AdminSchema.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('user is not exist');
        }
        // send EMAIL here
        console.log(user.activationNumber);
        return { success: true };
    }

    async confirmAuth(code, userId) {
        const user = await AdminSchema.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('user is not exist');
        }
        if (user.confirmAuthNumber !== Number(code)) {
            throw ApiError.BadRequest('code is invalid');
        }
        user.confirmAuthNumber = null;
        user.confirmAuthStatus = true;
        return await user.save();
    }

    async resendConfirmAuthCode(userId) {
        const user = await AdminSchema.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('user is not exist');
        }
        const confirmAuthCode = await this.generateCode();
        user.confirmAuthNumber = confirmAuthCode;
        await user.save();
        MailService.sendActivationMail(
            user?.email,
            `your code: ${confirmAuthCode}`
        );
        return { success: true };
    }

    async getAllUsers() {
        return AdminSchema.find();
    }

    async getCurrentUser(id) {
        const user = await AdminSchema.findById(id);
        return {
            ...user._doc,
            password: null,
            activationNumber: null,
            confirmAuthNumber: null,
            confirmAuthStatus: null,
        };
    }

    async getById(id) {
        const user = await AdminSchema.findById(id);
        return {
            ...user._doc,
            password: null,
            activationNumber: null,
            confirmAuthNumber: null,
            confirmAuthStatus: null,
        };
    }
}

module.exports = new UserService();
