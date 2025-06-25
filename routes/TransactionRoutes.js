const Router = require('express').Router;
const TransactionController = require('../controllers/TransactionController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AccessMiddleware = require('../middlewares/accessMiddleware');

const router = new Router();

router.post(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    TransactionController.createTransaction
);

router.get(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    TransactionController.getAllTransactions
);

router.get(
    '/:id',
    AuthMiddleware,
    AccessMiddleware,
    TransactionController.getById
);

router.get(
    '/by-employer/:id',
    AuthMiddleware,
    AccessMiddleware,
    TransactionController.getByEmployerId
);

router.put(
    '/update',
    AuthMiddleware,
    AccessMiddleware,
    TransactionController.updateTransaction
);

router.delete(
    '/delete/:id',
    AuthMiddleware,
    AccessMiddleware,
    TransactionController.deleteTransaction
);

module.exports = router;
