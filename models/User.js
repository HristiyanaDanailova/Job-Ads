const mongoose = require('mongoose');
const encryption = require('../util/encryption')

const UserSchema = new mongoose.Schema({
    email: { type: mongoose.SchemaTypes.String, required: true },
    hashedPass: { type: mongoose.SchemaTypes.String, required: true },
    descriptionOfSkills: { type: mongoose.SchemaTypes.String, required: true },
    myAds: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Ad' }],
    salt: { type: mongoose.SchemaTypes.String, required: true },
    roles: [{ type: mongoose.SchemaTypes.String }]
});

UserSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) == this.hashedPass;
    }
})

const User = mongoose.model('User', UserSchema);

User.seedAdmin = async () => {
    try {
        const users = await User.find();
        if (users.length > 0) {
            return;
        }
        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, '123456');
        return User.create({
            email: 'admin@mail.bg',
            hashedPass: hashedPass,
            descriptionOfSkills: 'admin',
            myAds: [],
            salt: salt,
            roles: ['Admin'],
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = User;
