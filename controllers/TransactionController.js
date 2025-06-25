const TransactionService = require('../services/TransactionService');

class TransactionController {
    async createTransaction(req, res, next) {
        try {
            const transaction = await TransactionService.create(req.body);
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async getAllTransactions(req, res, next) {
        try {
            const transactions = await TransactionService.getAll();
            return res.json(transactions);
        } catch (e) {
            next(e);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const transactions = await TransactionService.getById(id);
            return res.json(transactions);
        } catch (e) {
            next(e);
        }
    }

    async getByEmployerId(req, res, next) {
        try {
            const { id } = req.params;
            const transactions = await TransactionService.getByEmployerId(id);
            return res.json(transactions);
        } catch (e) {
            next(e);
        }
    }

    async updateTransaction(req, res, next) {
        try {
            const transaction = await TransactionService.update(req.body);
            res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async deleteTransaction(req, res, next) {
        try {
            const { id } = req.params;
            const transaction = await TransactionService.delete(id);
            res.json(transaction);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TransactionController();
