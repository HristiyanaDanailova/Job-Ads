module.exports = {
    development: {
        port: process.env.PORT || 3000,
        dbPath: 'mongodb://127.0.0.1:27017/jobads-db'
    },
    production: {}
};