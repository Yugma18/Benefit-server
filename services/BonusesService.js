const MailService = require('./MailService');
const ApiError = require('../exceptions/ApiError');
const BonusesModel = require('../models/Bonuses');
const CompanyModel = require('../models/Company');
const EmployeeModel = require('../models/Employee');
const UsersModel = require('../models/User');
const EmployerDto = require('../dtos/employerDto');
const EmployeeDto = require('../dtos/employeeUserDto');
const SignedBonusesModel = require('../models/SignedBonuses');
const TransactioModel = require('../models/Transactions')
const SignedBonuses = require('../models/SignedBonuses')

class BonusesService {
    async getAll() {}

    async getById(id) {
        return await BonusesModel.findOne({ employeeId: id });
    }

    async getBonusesByEmployerId(id) {
        const bonuses = await BonusesModel.find({
            employerId: id,
            isForgive: { $ne: true },
        });
        const employees = await EmployeeModel.find({ employerId: id });
        const signedBonuses = await SignedBonusesModel.find({ employerId: id });
        const transactions = await TransactioModel.find({ employerId: id });
        return await bonuses.map((bonus) => {
            const employee = employees.find(
                (employee) => bonus.employeeId === employee._id.toString()
            );
            const signedBonus = signedBonuses.find(
                (el) => bonus.employeeId === el.employeeId
            );
            const transaction = transactions.filter(
                (el) => bonus._id.toString() === el.bonusId
            );
            return {
                ...bonus._doc,
                employee: employee ? new EmployeeDto(employee) : null,
                signedBonus: signedBonus ? signedBonus : null,
                transactions: transaction.length > 0 ? transaction : null,
            };
        });
    }

    async getBonusesByEmployee() {
        const bonuses = await BonusesModel.find();
        const companies = await CompanyModel.find();
        const employers = await UsersModel.find();
        const employees = await EmployeeModel.find();
        const signedBonuses = await SignedBonuses.find()
        return bonuses.map((el) => {
            const employer = employers.find(
                (employer) => employer._id.toString() === el.employerId
            );
            const employee = employees.find(
                (employee) => el.employeeId === employee._id.toString()
            );
            const company = companies.find(
                (company) => company._id.toString() === employee?.companyId
            );
            const signedBonus = signedBonuses.find(bonus => bonus.bonusId === el._id.toString())
            return {
                ...el._doc,
                employee: employee ? new EmployeeDto(employee) : null,
                employer: employer ? new EmployerDto(employer) : null,
                company: company ? company : null,
                signedBonus: signedBonus ? signedBonus : null,
            };
        });
    }

    async create(plan) {
        return await BonusesModel.create(plan);
    }

    async createSignedBonus(bonus) {
        console.log(bonus);
        return await SignedBonuses.create(bonus);
    }

    async update(data) {
        return await BonusesModel.findByIdAndUpdate({ _id: data.id }, data);
    }

    async forgiveEmployee(id) {
        const isForgive = await BonusesModel.findByIdAndUpdate(
            { _id: id },
            { isForgive: true }
        );
        return isForgive;
    }

    async delete() {}

    async uploadDocument(user, location) {
        return await BonusesModel.findOneAndUpdate(
            { employeeId: user.id },
            { docs3FileKey: location }
        );
        // return {};
    }
}

module.exports = new BonusesService();
