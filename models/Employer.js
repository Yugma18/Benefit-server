const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployerSchema = new Schema({
    employerName: String,
    address: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    loanInterestRate: String,
    employeeList: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Employer", EmployerSchema);
