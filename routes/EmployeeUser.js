const Router = require('express').Router;
const employeeController = require('../controllers/EmployeeController');
const { body } = require('express-validator');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AccessMiddleware = require('../middlewares/accessMiddleware');

const router = new Router();

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 30 }),
    employeeController.registration
);
router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 30 }),
    employeeController.login
);
router.post('/logout', employeeController.logout);
router.post('/confirm-auth', employeeController.confirmAuth);
router.post('/resend-confirm-auth', employeeController.resendConfirmAuthCode);
router.post('/change-password', employeeController.changePassword);
router.post('/activate', employeeController.activate);
router.post('/resend-activate', employeeController.resendActivate);
router.get('/refresh', employeeController.refresh);
router.get('/', AuthMiddleware, AccessMiddleware, employeeController.getUsers);
router.get(
    '/current-employee',
    AuthMiddleware,
    AccessMiddleware,
    employeeController.getUser
);
router.get(
    '/get-employee',
    AuthMiddleware,
    AccessMiddleware,
    employeeController.getByIdx
);
router.get(
    '/get-employees/:companyId',
    AuthMiddleware,
    AccessMiddleware,
    employeeController.getEmployeesByCompany
);
router.get(
    '/get-employee/:id',
    AuthMiddleware,
    AccessMiddleware,
    employeeController.getEmployeesById
);
router.put(
    '/update-employee',
    AuthMiddleware,
    AccessMiddleware,
    employeeController.updateEmployee
);

router.get(
    '/:id',
    AuthMiddleware,
    AccessMiddleware,
    employeeController.getEmployeeById
);
router.delete('/:id', AuthMiddleware,
    AccessMiddleware,
    employeeController.deleteEmployee)

module.exports = router;
