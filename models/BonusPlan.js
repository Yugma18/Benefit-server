const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BonusPlanSchema = new Schema({
    goalBonus: String,
    vestingPeriod: String,
    type: String,
    startDate: Date,
    endDate: Date,
    vestingCliff: String,
    vestingFrequency: String,
    vested: String,
    nonVested: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("BonusPlan", BonusPlanSchema);
