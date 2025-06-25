const Router = require('express').Router;
const userController = require('../controllers/UserController');
const { body } = require('express-validator');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AccessMiddleware = require('../middlewares/accessMiddleware');

const router = new Router();

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 30 }),
    userController.registration
);
router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 30 }),
    userController.login
);
router.post('/logout', userController.logout);
router.post('/confirm-auth', userController.confirmAuth);
router.post('/resend-confirm-auth', userController.resendConfirmAuthCode);
router.post('/activate', userController.activate);
router.post('/resend-activate', userController.resendActivate);
router.post('/change-password', userController.changePassword);
router.get('/refresh', userController.refresh);
router.get('/', AuthMiddleware, AccessMiddleware, userController.getUsers);
router.get(
    '/current-user',
    AuthMiddleware,
    AccessMiddleware,
    userController.getUser
);
router.put(
    '/updateUser',
    AuthMiddleware,
    AccessMiddleware,
    userController.updateUser
);
router.get(
    '/:id',
    AuthMiddleware,
    AccessMiddleware,
    userController.getUserById
);
router.delete(
    '/:id',
    AuthMiddleware,
    AccessMiddleware,
    userController.deleteUser
);

module.exports = router;
