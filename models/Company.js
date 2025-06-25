const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    companyName: { type: String, required: true, unique: true },
    companyAddress: { type: String, required: true },
    companyCity: {type: String, required: true },
    companyCountry: {type: String, required: true },
    zipCode: {type: String, required: true },
    employees: { type: [String], default: [] },
    adminId: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Companies', CompanySchema);
