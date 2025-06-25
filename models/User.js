const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationNumber: { type: Number },
    roles: { type: [String], required: true },
    companyId: { type: String, required: true },
    isPwdChanged: {type: Boolean, default: false},
    confirmAuthNumber: { type: Number, default: null },
    confirmAuthStatus: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('User', UserSchema);
