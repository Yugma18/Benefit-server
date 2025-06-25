const settingService = require('../services/SettingService');

class SettingController {
  async getAllSettings(req, res) {
    try {
      const settings = await settingService.getAllSettings();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createSetting(req, res) {
    try {
      const newSetting = await settingService.createSetting(req.body);
      res.status(201).json(newSetting);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getSettingById(req, res) {
    try {
      const setting = await settingService.getSettingById(req.params.id);
      if (!setting) return res.status(404).json({ message: 'Setting not found' });
      res.json(setting);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateSetting(req, res) {
    try {
      const updatedSetting = await settingService.updateSetting(req.params.id, req.body);
      res.json(updatedSetting);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async deleteSetting(req, res) {
    try {
      await settingService.deleteSetting(req.params.id);
      res.json({ message: 'Setting deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new SettingController();
