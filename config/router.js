const homeController = require('../controllers/homeController');
const adController = require('../controllers/adController');
const userController = require('../controllers/userController');
const auth = require('../config/auth')

module.exports = app => {
    app.get('/', homeController.getHome);
    app.get('/search', homeController.getSearch);
    app.post('/search', homeController.postSearch)

    app.get('/ads/create', auth.isAuthed, adController.getCreate);
    app.post('/ads/create', auth.isAuthed, adController.postCreate);
    app.get('/all-ads', adController.getAllAds);
    app.get('/ads/details/:adId', adController.getAdDetails);
    app.get('/ads/edit/:adId', auth.isAuthed, adController.getEditAd);
    app.post('/ads/edit/:adId', auth.isAuthed, adController.postEditAd);
    app.get('/ads/delete/:adId', auth.isAuthed, adController.deleteAd);
    app.get('/ads/apply/:adId', auth.isAuthed, adController.postApply)

    app.get('/user/register', userController.getRegister);
    app.get('/user/login', userController.getLogin);
    app.post('/user/register', userController.postRegister);
    app.post('/user/login', userController.postLogin);
    app.get('/user/logout', auth.isAuthed, userController.logOut);

    app.all('*', homeController.error);

};