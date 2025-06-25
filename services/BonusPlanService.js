const BonusPlanModel = require("../models/BonusPlan");

exports.createBonus = async (bonus) => {
    return await BonusPlanModel.create(bonus);
};
exports.getBonusById = async (id) => {
    return BonusPlanModel.findById(id);
};

exports.updateBonus = async (id, bonus) => {
    return BonusPlanModel.findByIdAndUpdate(id, bonus);
};

exports.deleteBonus = async (id) => {
    return BonusPlanModel.findByIdAndDelete(id);
};
