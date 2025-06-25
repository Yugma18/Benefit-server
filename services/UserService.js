const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const CompanyModel = require('../models/Company');
const MailService = require('./MailService');
const TokenService = require('./TokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../exceptions/ApiError');

class UserService {
    async registration(userData) {
        const { firstName, lastName, email, password, roles, companyId } =
            userData;
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest('user is exist');
        }
        const genereatedPassword = await this.generatePassword();
        const code = await this.generateCode();
        const hashPassword = await bcrypt.hash(genereatedPassword, 3);
        const user = await UserModel.create({
            email,
            password: hashPassword,
            firstName,
            lastName,
            roles,
            activationNumber: code,
            companyId,
        });
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        MailService.sendInviteMail(email, {
            name: firstName,
            login: email,
            password: genereatedPassword,
            link: process.env.EMPLOYER_URL,
        });
        return {
            // ...tokens,
            user: userDto,
        };
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
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
        const user = await UserModel.findById(userData.id);
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

    async generatePassword(length = 10) {
        const charset =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

    async activate(code, userId, res) {
        const user = await UserModel.findById(userId);
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

    async changePassword(id, password, newPassword) {
        const user = await UserModel.findById(id);
        console.log(id, password, newPassword, user);
        if (!user) {
            throw ApiError.BadRequest('User does not exist');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password');
        }
        const hashPassword = await bcrypt.hash(newPassword, 3);
        user.password = hashPassword;
        user.confirmAuthStatus = true;
        user.isPwdChanged = true;
        await user.save();
        return new UserDto(user);
    }

    async resendActivateCode(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('user is not exist');
        }
        // send EMAIL here
        const activateCode = await this.generateCode();
        user.activationNumber = activateCode;
        await user.save();
        MailService.sendActivationMail(
            user?.email,
            `your code: ${activateCode}`
        );
        return { success: true };
    }

    async confirmAuth(code, userId) {
        const user = await UserModel.findById(userId);
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
        const user = await UserModel.findById(userId);
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

    async getCurrentUser(id) {
        const user = await UserModel.findById(id);
        const company = await CompanyModel.findById(user.companyId);
        const userDto = new UserDto(user);
        return {
            ...userDto,
            company,
        };
    }

    async getAllUsers() {
        const companies = await CompanyModel.find();
        const users = await UserModel.find();
        return users.map((el) => {
            return {
                ...el._doc,
                company: companies.find(
                    (company) => el.companyId === company._id.toString()
                ),
                password: null,
                confirmAuthNumber: null,
            };
        });
    }

    async getUserById(id) {
        const user = await UserModel.findById(id);
        const company = await CompanyModel.findById(user.companyId);
        const userDto = new UserDto(user);
        return {
            ...userDto,
            company,
        };
    }

    async updateUser(data) {
        const { id, firstName, lastName, email, companyId } = data;
        const candidate = await UserModel.findOne({ email });
        if (candidate && id !== candidate.id) {
            throw ApiError.BadRequest('Employer is exist');
        }
        const user = await UserModel.findByIdAndUpdate(
            { _id: id },
            {
                firstName,
                lastName,
                email,
                companyId,
            }
        );
        const userDto = new UserDto(user);
        return {
            ...userDto,
        };
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}

module.exports = new UserService();
