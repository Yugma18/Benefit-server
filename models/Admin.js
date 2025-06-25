const { Schema, model } = require('mongoose');

const AdminSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationNumber: { type: Number },
    confirmAuthNumber: { type: Number, default: null },
    confirmAuthStatus: { type: Boolean, default: true },
    roles: { type: [String], required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('Admin', AdminSchema);
