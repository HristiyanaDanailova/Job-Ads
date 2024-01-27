const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    headline: { type: mongoose.SchemaTypes.String, required: true },
    location: { type: mongoose.SchemaTypes.String, required: true },
    companyName: { type: mongoose.SchemaTypes.String, required: true },
    companyDescription: { type: mongoose.SchemaTypes.String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    usersApplied: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Ad', AdSchema);

AdSchema.path('headline').validate(function (value) {
    return value.length > 3 && value.length < 50;
}, 'Headline should be between 3 and 50 symbols long');
AdSchema.path('location').validate(function (value) {
    return value.length > 5 && value.length < 50;
}, 'Location should be between 5 and 50 symbols long');
AdSchema.path('companyName').validate(function (value) {
    return value.length > 5 && value.length < 50;
}, 'Location should be between 5 and 50 symbols long');
AdSchema.path('companyDescription').validate(function (value) {
    return value.length > 5 && value.length < 256;
}, 'Location should be between 5 and 206 symbols long');