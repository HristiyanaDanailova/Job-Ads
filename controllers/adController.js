const Ad = require("../models/Ad");
const User = require('../models/User')
module.exports = {
    getCreate: (req, res) => {
        res.render('ads/create')
    },
    postCreate: (req, res) => {
        const adBody = req.body;
        if (!adBody.headline || !adBody.location || !adBody.companyName || !adBody.companyDescription) {
            res.render('ads/create', { adBody, error: 'Please fill all fields!' });
            return;
        }
        const userId = (req.user._id).toString();
        const ad = new Ad({
            headline: adBody.headline,
            location: adBody.location,
            companyName: adBody.companyName,
            companyDescription: adBody.companyDescription,
            author: userId,
            usersApplied: []
        });
        ad.save().then((ad) => {
            User.findById(userId).then((user) => {
                user.myAds.push(ad);
                user.save();
            })
        }).then(() => {
            res.redirect('/all-ads');
            return;
        }).catch((error) => {
            console.log(error);
            res.render('ads/create', { error: 'Something went wrong! :(' });
            return;
        });
    },
    getAllAds: (req, res) => {
        Ad.find().lean().then((ads) => {
            res.render('ads/all-ads', { ads });
        }).catch((error) => {
            console.log(error);
            res.render('home/home', { error: 'Something went wrong! :(' })
        });
    },
    getAdDetails: (req, res) => {
        const adId = req.params.adId;
        let isAuthor = false;
        let hasApplied = false;
        Ad.findById(adId).lean().populate('author').populate('usersApplied').then((ad) => {
            if (req.user) {
                const userId = (req.user._id).toString();
                if (userId === (ad.author._id).toString()) {
                    isAuthor = true;
                }
                if (ad.usersApplied.map(x => x._id.toString()).includes(userId)) {
                    hasApplied = true;
                }
            }

            res.render('ads/details', { ad, isAuthor, hasApplied });
        }).catch((error) => {
            console.log(error);
            res.render('ads/all-ads', { error: 'Something went wrong! :(' })
        });
    },
    getEditAd: (req, res) => {
        const adId = req.params.adId;
        Ad.findById(adId).lean().then((ad) => {
            res.render('ads/edit', ad);
        }).catch((error) => {
            console.log(error);
            res.render('home/home', { error: 'Something went wrong! :(' })
        })
    },
    postEditAd: (req, res) => {
        const adBody = req.body;
        if (!adBody.headline || !adBody.location || !adBody.companyDescription || !adBody.companyName) {
            res.render('ads/edit', { adBody, error: 'Please fill all fields!' });
            return;
        }
        Ad.findByIdAndUpdate(adId, {
            headline: adBody.headline,
            location: adBody.location,
            companyName: adBody.companyName,
            companyDescription: adBody.companyDescription
        }).then(() => {
            res.redirect(`/ads/details/${adId}`);
            return;
        }).catch((error) => {
            console.log(error);
            res.render('ads/details', { adBody, error: 'Something went wrong! :(' });
            return;
        })

    },
    deleteAd: (req, res) => {
        const userId = (req.user._id).toString();
        const adId = req.params.adId;
        Ad.findById(adId).then((ad) => {
            if (!ad) {
                res.render('ads/all-ads', { error: 'An error occurred' });
                return;
            }
            if (ad.author.toString() !== userId) {
                res.render('ads/all-ads', { error: 'Unauthorized to perform deletion' });
                return;
            }
            return Ad.findByIdAndDelete(adId);
        }).then(() => {
            return User.findById(userId);
        }).then((user) => {
            user.myAds.pull(adId);
            return user.save();
        }).then(() => {
            res.redirect('/all-ads');
            return;
        }).catch((error) => {
            console.log(error);
            res.render('ads/all-ads', { error: 'Something went wrong! :(' });
        })
    },
    postApply: (req, res) => {
        const adId = req.params.adId;
        const userId = (req.user._id).toString();
        User.findById(userId)
            .then((user) => {
                user.myAds.push(adId);
                user.save();
            }).then(() => {
                const ad = Ad.findById(adId).then((ad) => {
                    ad.usersApplied.push(userId);
                    ad.save();
                });
                return ad;
            }).then(() => {
                res.redirect(`/ads/details/${adId}`);
                return;
            }).catch((error) => {
                console.log(error);
                res.render('ads/all-ads', { error: 'Something went wrong! :(' });
                return;
            })
    }
}