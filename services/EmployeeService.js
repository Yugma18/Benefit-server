const bcrypt = require('bcrypt');
const EmployeeModel = require('../models/Employee');
const UsersModel = require('../models/User');
const CompanyModel = require('../models/Company');
const MailService = require('./MailService');
const TokenService = require('./TokenService');
const EmployeeDto = require('../dtos/employeeUserDto');
const EmployerDto = require('../dtos/employerDto');
const ApiError = require('../exceptions/ApiError');
const BonusesModel = require('../models/Bonuses');
const SignedBonuses = require('../models/SignedBonuses');

class EmployeeService {
    async registration(userData) {
        const {
            firstName,
            lastName,
            email,
            password,
            roles,
            image,
            phone,
            departmentId,
            employerId,
            employeeId,
            uei,
            startDate,
            bonusPlanId,
            companyId,
            anualBudget,
        } = userData;
        const candidate = await EmployeeModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest('Employee is exist');
        }
        const genereatedPassword = await this.generatePassword();
        const hashPassword = await bcrypt.hash(genereatedPassword, 3);
        const code = await this.generateCode();
        const user = await EmployeeModel.create({
            email,
            password: hashPassword,
            firstName,
            lastName,
            roles,
            activationNumber: code,
            image,
            phone,
            departmentId,
            employerId,
            employeeId,
            uei,
            startDate,
            bonusPlanId,
            companyId,
            anualBudget
        });
        const userDto = new EmployeeDto(user);
        MailService.sendInviteMail(email, {
            name: firstName,
            login: email,
            password: genereatedPassword,
            link: process.env.EMPLOYEE_URL,
        });
        return {
            user: userDto,
        };
    }

    async login(email, password) {
        const user = await EmployeeModel.findOne({ email });
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
        const userDto = new EmployeeDto(user);
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
        const user = await EmployeeModel.findById(userData.id);
        const userDto = new EmployeeDto(user);
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

    async changePassword(id, password, newPassword) {
        const user = await EmployeeModel.findById(id);
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
        return new EmployeeDto(user);
    }

    async resendActivateCode(userId) {
        const user = await EmployeeModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('user is not exist');
        }
        const activateCode = await this.generateCode();
        user.activationNumber = activateCode;
        await user.save();
        MailService.sendActivationMail(
            user?.email,
            `your code: ${activateCode}`
        );
        return { success: true };
    }

    async activate(code, userId, res) {
        const user = await EmployeeModel.findById(userId);
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

    async confirmAuth(code, userId) {
        const user = await EmployeeModel.findById(userId);
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
        const user = await EmployeeModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('user is not exist');
        }
        // send EMAIL here
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
        const bonuses = await BonusesModel.find();
        const companies = await CompanyModel.find();
        const employers = await UsersModel.find();
        const employee = await EmployeeModel.find();
        const signedBonuses = await SignedBonuses.find();
        return employee.map((el) => {
            const employer = employers.find(
                (employer) => employer._id.toString() === el.employerId
            );
            const company = companies.find(
                (company) => company._id.toString() === el.companyId
            );
            const bonus = bonuses.find((bonus) => bonus.employeeId === el.id);
            const signedBonus = signedBonuses.find(
                (bonus) => bonus.employeeId === el._id.toString()
            );
            return {
                ...el._doc,
                bonus: bonus ? bonus : null,
                employer: employer ? new EmployerDto(employer) : null,
                company: company ? company : null,
                signedBonus: signedBonus ? signedBonus : null,
                password: null,
                confirmAuthNumber: null,
                confirmAuthStatus: null,
            };
        });
    }

    async getEmployeesByIdx(id) {
        const employees = await EmployeeModel.find({ employerId: id });
        const employeeBonuses = await BonusesModel.find({ employerId: id });
        const companies = await CompanyModel.find();
        return employees.map((employee) => {
            const bonuses = employeeBonuses.find((bonus) => {
                return bonus.employeeId === employee._id.toString();
            });
            const company = companies.find(
                (company) => company._id.toString() === employee.companyId
            );
            return {
                bonus: bonuses ? bonuses : null,
                company: company ? company : null,
                ...employee._doc,
            };
        });
    }

    async getEmployeesByCompany(id) {
        console.log(id);
        const bonuses = await BonusesModel.find();
        const companies = await CompanyModel.find();
        const employers = await UsersModel.find();
        const employee = await EmployeeModel.find({ companyId: id });
        return employee.map((el) => {
            const employer = employers.find(
                (employer) => employer._id.toString() === el.employerId
            );
            const company = companies.find(
                (company) => company._id.toString() === el.companyId
            );
            const bonus = bonuses.find((bonus) => bonus.employeeId === el.id);
            return {
                ...el._doc,
                bonus: bonus ? bonus : null,
                employer: employer ? new EmployerDto(employer) : null,
                company: company ? company : null,
                password: null,
                confirmAuthNumber: null,
                confirmAuthStatus: null,
            };
        });
    }

    async getEmployeeById(id) {
        const employee = await EmployeeModel.findById(id);
        const bonuses = await BonusesModel.findOne({ employeeId: id });
        const companies = await CompanyModel.find();
        const company = companies.find(
            (company) => company._id.toString() === employee.companyId
        );
        return {
            bonus: bonuses ? bonuses : null,
            company: company ? company : null,
            ...employee._doc,
        };
    }

    async getEmployeesById(id) {
        const employees = await EmployeeModel.find({ employerId: id });
        const employeeBonuses = await BonusesModel.find({ employerId: id });
        const companies = await CompanyModel.find();
        return employees.map((employee) => {
            const bonuses = employeeBonuses.find((bonus) => {
                return bonus.employeeId === employee._id.toString();
            });
            const company = companies.find(
                (company) => company._id.toString() === employee.companyId
            );
            return {
                bonus: bonuses ? bonuses : null,
                company: company ? company : null,
                ...employee._doc,
            };
        });
    }

    async updateEmployee(data) {
        console.log(data);
        const {
            id,
            firstName,
            lastName,
            uei,
            phone,
            email,
            employeeId,
            employerId,
            startDate,
            departmentId,
            companyId,
            anualBudget
        } = data;
        const candidate = await EmployeeModel.findOne({ email });
        if (candidate && id !== candidate.id) {
            throw ApiError.BadRequest('Employee is exist');
        }
        const employee = await EmployeeModel.findByIdAndUpdate(
            { _id: id },
            {
                firstName,
                lastName,
                uei,
                phone,
                email,
                employeeId,
                employerId,
                startDate,
                departmentId,
                companyId,
                anualBudget
            }
        );
        return employee;
    }

    async getCurrentUser(id) {
        const user = await EmployeeModel.findById(id);
        const company = await CompanyModel.findById(user.companyId);
        const bonus = await BonusesModel.findOne({ employeeId: user.id });
        const employer = await UsersModel.findById(user.employerId);
        const userDto = new EmployeeDto(user);
        const employerDto = new EmployerDto(employer);
        return {
            ...userDto,
            company,
            bonus,
            employer: employerDto ? employerDto : null,
        };
    }

    async deleteEmployee(id) {
        const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);
        const deletedBonus = await BonusesModel.findOneAndDelete({
            employeeId: id,
        });
        return {
            deletedEmployee,
            deletedBonus,
        };
    }
}

module.exports = new EmployeeService();
