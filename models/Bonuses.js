const { Schema, model } = require('mongoose');

const BonusesSchema = new Schema({
    activeAmount: { type: String },
    typeOfPlan: { type: String },
    amount: { type: String },
    amountToVest: { type: String, default: null },
    employerId: { type: String, required: true },
    employeeId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    interestRate: { type: String, default: null },
    planType: { type: String, required: true },
    planStatus: { type: String, default: 'active' },
    taxBenefit: { type: String },
    vestingCliff: { type: Number, required: true },
    vestingFreq: { type: Number, required: true },
    vestingPeriod: { type: Number, required: true },
    docs3FileKey: { type: String, default: null },
    isForgive: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('Bonuses', BonusesSchema);
