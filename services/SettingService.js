const Setting = require('../models/Setting');

class SettingService {
  async getAllSettings() {
    return await Setting.find();
  }

  async createSetting(settingData) {
    return await Setting.create(settingData);
  }

  async getSettingById(id) {
    return await Setting.findById(id);
  }

  async updateSetting(id, newData) {
    return await Setting.findByIdAndUpdate(id, newData, { new: true });
  }

  async deleteSetting(id) {
    return await Setting.findByIdAndDelete(id);
  }
}

module.exports = new SettingService();
