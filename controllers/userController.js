const encryption = require('../util/encryption');
const User = require('../models/User')

module.exports = {
    getRegister: (req, res) => {
        res.render('user/register')
    },
    getLogin: (req, res) => {
        res.render('user/login')
    },
    postLogin: (req, res) => {
        const userBody = req.body;
        if (!userBody.email || !userBody.password) {
            userBody.error = 'Please fill all fields';
            res.render('user/login', { userBody, error: 'Please fill all fields!' });
            return;
        }
        User.findOne({ email: userBody.email }).then((user) => {
            if (!user) {
                res.render('user/login', { userBody, error: 'Invalid email!' });
                return;
            }
            if (!user.authenticate(userBody.password)) {
                res.render('user/login', { userBody, error: 'Invalid password!' });
                return;
            }
            req.logIn(user, (err) => {
                if (err) {
                    res.render('user/login', { userBody, error: err });
                    return;
                } else {
                    res.redirect('/');
                }
            })
        }).catch((err) => {
            console.log(err);
            res.render('user/register', { userBody, error: 'Something went wrong! :(' });
        })
    },

    postRegister: async (req, res) => {
        const userBody = req.body;
        if (!userBody.email || !userBody.password || !userBody.repeatedPassword || !userBody.skills) {
            res.render('user/register', { userBody, error: 'Please fill all fields!' });
            return;
        }
        if (userBody.password !== userBody.repeatedPassword) {
            res.render('user/register', { userBody, error: 'Password and repeated password must match' });
            return;
        }
        const salt = encryption.generateSalt();
        const hashedPassword = encryption.generateHashedPassword(salt, userBody.password);
        User.create({
            email: userBody.email,
            hashedPass: hashedPassword,
            descriptionOfSkills: userBody.skills,
            myAds: [],
            salt: salt,
            roles: ['User']

        }).then((user) => {
            req.logIn(user, (error) => {
                if (error) {
                    console.log(error);
                    res.render('user/register', { userBody, error: 'Something went wrong! :(' });
                } else {
                    res.redirect('/');
                }
            })
        }).catch((error) => {
            console.log(error);
            res.render('user/register', { userBody, error: 'Something went wrong! :(' });
        });
    },
    logOut: (req, res) => {
        req.logout(req.user, err => {
            if (err) {
                console.log(err);
                res.render('user/register', { userBody, error: 'Something went wrong! :(' });
            }
            res.redirect("/");
        });
    }

}