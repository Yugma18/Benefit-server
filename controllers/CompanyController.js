const CompanyService = require('../services/CompanyService');

class CompanyController {
    async getAllCompanies(req, res, next) {
        try {
            const company = await CompanyService.getAll();
            return res.json(company);
        } catch (e) {
            next(e);
        }
    }

    async getCompanyById(req, res, next) {
        try {
            const { id } = req.params;
            const company = await CompanyService.getById(id);
            return res.json(company);
        } catch (e) {
            next(e);
        }
    }

    async createCompany(req, res, next) {
        try {
            const company = await CompanyService.create(req.body);
            return res.json(company);
        } catch (e) {
            next(e);
        }
    }

    async updateCompany(req, res, next) {
        try {
            const bonus = await CompanyService.update(req.body);
            res.json(bonus);
        } catch (e) {
            next(e);
        }
    }

    async deleteCompany(req, res, next) {
        try {
            const { id } = req.params;
            const company = await CompanyService.delete(id);
            res.json(company);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CompanyController();
