const Router = require('express').Router;
const departmentController = require('../controllers/DepartmentController');
const { body } = require('express-validator');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AccessMiddleware = require('../middlewares/accessMiddleware');

const router = new Router();

router.post('/', AuthMiddleware, AccessMiddleware, departmentController.create);
router.get(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    departmentController.allDepartments
);

module.exports = router;
