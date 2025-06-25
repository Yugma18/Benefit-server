const express = require("express");
const {
    createBonus,
    getBonusById,
    updateBonus,
    deleteBonus,
} = require("../controllers/BonusPlanController");

const router = express.Router();

router.route("/").post(createBonus);
router.route("/:id").get(getBonusById).put(updateBonus).delete(deleteBonus);

module.exports = router;
