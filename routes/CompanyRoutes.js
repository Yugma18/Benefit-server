const Router = require('express').Router;
const CompanyController = require('../controllers/CompanyController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AccessMiddleware = require('../middlewares/accessMiddleware');

const router = new Router();

router.post(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    CompanyController.createCompany
);
router.get(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    CompanyController.getAllCompanies
);
router.get(
    '/:id',
    AuthMiddleware,
    AccessMiddleware,
    CompanyController.getCompanyById
);
router.put(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    CompanyController.updateCompany
);
router.delete(
    '/:id',
    AuthMiddleware,
    AccessMiddleware,
    CompanyController.deleteCompany
);

module.exports = router;
