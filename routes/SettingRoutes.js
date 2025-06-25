const express = require('express');
const router = express.Router();
const settingController = require('../controllers/SettingController');

router.get('/', settingController.getAllSettings);
router.post('/', settingController.createSetting);
router.get('/:id', settingController.getSettingById);
router.put('/:id', settingController.updateSetting);
router.delete('/:id', settingController.deleteSetting);

module.exports = router;
