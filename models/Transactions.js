const { Schema, model } = require('mongoose');

const Transactions = new Schema({
    employeeId: { type: String, required: true },
    employerId: { type: String, required: true },
    companyId: { type: String, required: true },
    signedBonusId: { type: String, required: true },
    bonusId: { type: String, required: true },
    bankName: { type: String, default: null },
    description: { type: String, default: null },
    date: { type: String, required: true },
    currency: { type: String, default: null },
    externalId: { type: String, default: null },
    paymentSystem: { type: String, required: true },
    amount: { type: Number, required: true },
    bonusAmount: { type: Number, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('Transactions', Transactions);
