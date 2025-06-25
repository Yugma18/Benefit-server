const Router = require('express').Router;
const bonusesController = require('../controllers/BonusesController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AccessMiddleware = require('../middlewares/accessMiddleware');
const { fileDocUploader } = require('../configs/file-downloader');

const router = new Router();

router.get('/', AuthMiddleware, AccessMiddleware, bonusesController.getBonuses);
router.get(
    '/bonuses-by-employee',
    AuthMiddleware,
    AccessMiddleware,
    bonusesController.getBonusesByEmployee
);
router.get(
    '/:id',
    AuthMiddleware,
    AccessMiddleware,
    bonusesController.getBonusById
);
router.post(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    bonusesController.createBonus
);

router.post(
    '/signed-bonus',
    AuthMiddleware,
    AccessMiddleware,
    bonusesController.createSignedBonus
);

router.post(
    '/upload-document',
    AuthMiddleware,
    AccessMiddleware,
    fileDocUploader.single('file'),
    bonusesController.uploadDocument
);

router.put(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    bonusesController.updateBonus
);
router.delete(
    '/',
    AuthMiddleware,
    AccessMiddleware,
    bonusesController.deleteBonus
);

router.put(
    '/forgive/:id',
    AuthMiddleware,
    AccessMiddleware,
    bonusesController.forgiveEmployee
);

router.get(
    '/employer/:id',
    AuthMiddleware,
    AccessMiddleware,
    bonusesController.getBonusesByEmployerId
);

module.exports = router;
