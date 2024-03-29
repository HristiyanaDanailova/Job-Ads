const env = process.env.NODE_ENV || 'development';

const config = require('./config/config')[env];
require('./config/database')(config);

const app = require('express')();

require('./config/express')(app);
require('./config/router')(app);
require('./config/passport')();
app.listen(config.port, () => console.log(`Server listening on port ${config.port}...`))