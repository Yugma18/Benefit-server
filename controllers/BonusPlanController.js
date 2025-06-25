const bonusPlanService = require("../services/BonusPlanService");

exports.createBonus = async (req, res) => {
    try {
        const bonus = await bonusPlanService.createBonus(req.body);
        res.json({ data: bonus, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBonusById = async (req, res) => {
    try {
        const bonus = await bonusPlanService.getBonusById(req.params.id);
        res.json({ data: bonus, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBonus = async (req, res) => {
    try {
        const bonus = await bonusPlanService.updateBonus(req.params.id, req.body);
        res.json({ data: bonus, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBonus = async (req, res) => {
    try {
        const bonus = await bonusPlanService.deleteBonus(req.params.id);
        res.json({ data: bonus, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
