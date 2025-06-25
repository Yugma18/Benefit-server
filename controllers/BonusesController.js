const BonusesService = require('../services/BonusesService');

class BonusesController {
    async getBonuses(req, res, next) {
        try {
            const bonus = await BonusesService.getAll();
            return res.json(bonus);
        } catch (e) {
            next(e);
        }
    }

    async getBonusesByEmployee(req, res, next) {
        try {
            const bonuses = await BonusesService.getBonusesByEmployee();
            return res.json(bonuses);
        } catch (e) {
            next(e);
        }
    }

    async getBonusById(req, res, next) {
        try {
            const { id } = req.params;
            const bonus = await BonusesService.getById(id);
            return res.json(bonus);
        } catch (e) {
            next(e);
        }
    }

    async getBonusesByEmployerId(req, res, next) {
        try {
            const { id } = req.params;
            const bonus = await BonusesService.getBonusesByEmployerId(id);
            return res.json(bonus);
        } catch (e) {
            next(e);
        }
    }

    async forgiveEmployee(req, res, next) {
        try {
            const { id } = req.params;
            const employees = await BonusesService.forgiveEmployee(id);
            return res.json(employees);
        } catch (e) {
            next(e);
        }
    }

    async createBonus(req, res, next) {
        try {
            const bonus = await BonusesService.create(req.body);
            return res.json(bonus);
        } catch (e) {
            next(e);
        }
    }

    async createSignedBonus(req, res, next) {
        try {
            const bonus = await BonusesService.createSignedBonus(req.body);
            return res.json(bonus);
        } catch (e) {
            next(e);
        }
    }

    async updateBonus(req, res, next) {
        try {
            const bonus = await BonusesService.update(req.body);
            res.json(bonus);
        } catch (e) {
            next(e);
        }
    }

    async deleteBonus(req, res, next) {
        try {
            const bonus = await BonusesService.delete();
            res.json(bonus);
        } catch (e) {
            next(e);
        }
    }

    async uploadDocument(req, res, next) {
        try {
            const file = await BonusesService.uploadDocument(
                req.user,
                req.file.location
            );
            res.json(file);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BonusesController();
