const { Schema, model } = require('mongoose');

const SignedBonuses = new Schema({
    bonusId: { type: String, required: true },
    employeeId: { type: String, required: true },
    employerId: { type: String, required: true },
    companyId: { type: String, required: true },
    amount: { type: Number, required: true },
    workEmail: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirthday: { type: String, required: true },
    percentage: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    prevAddress: { type: String, required: true },
    sin: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('SignedBonuses', SignedBonuses);
