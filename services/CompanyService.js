const CompanyModel = require('../models/Company');

class CompanyService {
    async getAll() {
        return await CompanyModel.find();
    }

    async getById(id) {
        return await CompanyModel.findById(id);
    }

    async create(company) {
        return await CompanyModel.create(company);
    }

    // async getBonusesByEmployerId(id) {
    //     const bonuses = await BonusesModel.find({ employerId: id });
    //     const employees = await EmployeeModel.find({ employerId: id });
    //     return await bonuses.map((bonus) => {
    //         const employee = employees.filter((employee) => {
    //             return bonus.employeeId === employee._id.toString();
    //         });
    //         return {
    //             ...bonus._doc,
    //             employee: { ...employee[0]._doc, password: null },
    //         };
    //     });
    // }

    async update(company) {
        return await CompanyModel.findByIdAndUpdate(
            { _id: company.id },
            company
        );
    }

    async delete(id) {
        return await CompanyModel.findByIdAndDelete(id);
    }
}

module.exports = new CompanyService();
