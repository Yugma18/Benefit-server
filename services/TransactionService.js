const ApiError = require('../exceptions/ApiError');
const EmployeeDto = require('../dtos/employeeUserDto')
const EmployerDto = require('../dtos/userDto')
const TransactionModel = require('../models/Transactions');
const CompanyModel = require('../models/Company');
const BonusesModel = require('../models/Bonuses')
const EmployeeModel = require('../models/Employee')
const EmployerModel = require('../models/User')
const SignedBonusModel = require('../models/SignedBonuses')

class CompanyService {
    async getAll() {
        const Transactions = await TransactionModel.find();
        const Companies = await CompanyModel.find();
        const Bonuses = await BonusesModel.find();
        const Employee = await EmployeeModel.find();
        const Employer = await EmployerModel.find();
        const SignedBonuses = await SignedBonusModel.find();
        return Transactions.map((transaction) => {
            const company = Companies.find(
                (el) => el._id.toString() === transaction.companyId
            );
            const bonus = Bonuses.find(
                (el) => el._id.toString() === transaction.bonusId
            );
            const employee = Employee.find(
                (el) => el._id.toString() === transaction.employeeId
            );
            const employer = Employer.find(
                (el) => el._id.toString() === transaction.employerId
            );
            const signedBonuses = SignedBonuses.find(
                (el) => el._id.toString() === transaction.signedBonusId
            );
            return {
                ...transaction._doc,
                company: company ? company : null,
                bonus: bonus ? bonus : null,
                employee: employee ? new EmployeeDto(employee) : null,
                employer: employer ? new EmployerDto(employer) : null,
                signedBonuses: signedBonuses ? signedBonuses : null,
            };
        });
    }

    async getByEmployerId(id) {
        const Transactions = await TransactionModel.find({employerId: id});
        const Companies = await CompanyModel.find();
        const Bonuses = await BonusesModel.find();
        const Employee = await EmployeeModel.find();
        const Employer = await EmployerModel.find();
        const SignedBonuses = await SignedBonusModel.find();
        return Transactions.map((transaction) => {
            const company = Companies.find(
                (el) => el._id.toString() === transaction.companyId
            );
            const bonus = Bonuses.find(
                (el) => el._id.toString() === transaction.bonusId
            );
            const employee = Employee.find(
                (el) => el._id.toString() === transaction.employeeId
            );
            const employer = Employer.find(
                (el) => el._id.toString() === transaction.employerId
            );
            const signedBonuses = SignedBonuses.find(
                (el) => el._id.toString() === transaction.signedBonusId
            );
            return {
                ...transaction._doc,
                company: company ? company : null,
                bonus: bonus ? bonus : null,
                employee: employee ? new EmployeeDto(employee) : null,
                employer: employer ? new EmployerDto(employer) : null,
                signedBonuses: signedBonuses ? signedBonuses : null,
            };
        });
    }

    async getById(id) {
        const Transaction = await TransactionModel.findById(id);
        const Companies = await CompanyModel.findById(Transaction.companyId);
        const Bonuses = await BonusesModel.findById(Transaction.bonusId);
        const Employee = await EmployeeModel.findById(Transaction.employeeId);
        const Employer = await EmployerModel.findById(Transaction.employerId);
        const SignedBonuses = await SignedBonusModel.findById(
            Transaction.signedBonusId
        );
        return {
            ...Transaction._doc,
            company: Companies ? Companies : null,
            bonus: Bonuses ? Bonuses : null,
            employee: Employee ? new EmployeeDto(Employee) : null,
            employer: Employer ? new EmployerDto(Employer) : null,
            signedBonuses: SignedBonuses ? SignedBonuses : null,
        };
    }

    async create(transaction) {
        try {
            console.log(transaction);
            return await TransactionModel.create(transaction);
        } catch (e) {
            throw ApiError.BadRequest('Transaction: Something went wrong.');
        }
    }

    async update(transaction) {
        return await TransactionModel.findByIdAndUpdate(
            { _id: transaction.id },
            transaction
        );
    }

    async delete(id) {
        return await TransactionModel.findByIdAndDelete(id);
    }
}

module.exports = new CompanyService();
