const { Schema, model } = require('mongoose');

const FileSchema = new Schema({
    "Course name": { type: String},
    "Degree type": { type: String},
    Interest: { type: String},
    Institution: { type: String},
    Language: { type: String},
    Delivery: { type: String },
    Location: { type: String },
    Duration: { type: String },
    "Cost - $CAD": { type: String },
    "Link (for detail page)": { type: String},
    Target: { type: String },
});

module.exports = model('file', FileSchema);
