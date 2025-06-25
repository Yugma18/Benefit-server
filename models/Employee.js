const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationNumber: { type: Number },
    isPwdChanged: { type: Boolean, default: false },
    roles: { type: [String], required: true },
    image: { type: String, default: null },
    phone: { type: String, required: true },
    departmentId: { type: String, required: true },
    employerId: { type: String, required: true },
    employeeId: { type: String, required: true },
    uei: { type: String, required: true },
    startDate: { type: Date, required: true },
    bonusPlanId: { type: String, default: null },
    companyId: { type: String, required: true },
    confirmAuthNumber: { type: Number, default: null },
    confirmAuthStatus: { type: Boolean, default: false },
    anualBudget: {type: Number, default: 4000},
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
