const Ad = require('../models/Ad')
module.exports = {
    getHome: (req, res) => {
        Ad.find().lean().then((ads) => {
            const adsSliced = ads.slice(0, 3);
            res.render('home/home', { ads: adsSliced });
        }).catch((error) => {
            console.log(error);
            res.render('home/home', { error: 'Something went wrong! :(' });
        })
    },
    getSearch: (req, res) => {
        res.render('home/search')
    },
    postSearch: (req, res) => {
        const { search } = req.body;
        if (!search) {
            res.render('home/search', { error: "Invalid search parameter" });
            return;
        }
        Ad.find().lean().then((ads) => {
            const filtered = ads.filter(ad => ad.headline.toLowerCase().includes(search.toLowerCase()));
            res.render('home/search', { ads: filtered });
        }).catch((err) => {
            console.log(error);
            res.render('home/search', { error: 'Something went wrong! :(' });
            return;
        });
    },
    error: (req, res) => {
        res.render('error/404')
    }
}