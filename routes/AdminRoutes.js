const Router = require('express').Router;
const adminController = require('../controllers/AdminController');
const { body } = require('express-validator');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AccessMiddleware = require('../middlewares/accessMiddleware');

const router = new Router();


router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 30 }),
    adminController.registration
);
router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 30 }),
    adminController.login
);
router.post('/logout', adminController.logout);
router.post('/confirm-auth', adminController.confirmAuth);
router.post('/resend-confirm-auth', adminController.resendConfirmAuthCode);
router.post('/activate', adminController.activate);
router.post('/resend-activate', adminController.resendActivate);
router.get('/refresh', adminController.refresh);
router.get('/', AuthMiddleware, AccessMiddleware, adminController.getUsers);
router.get(
    '/current-user',
    AuthMiddleware,
    AccessMiddleware,
    adminController.getUser
);
router.get(
    '/:id',
    AuthMiddleware,
    AccessMiddleware,
    adminController.getById
);



module.exports = router;
