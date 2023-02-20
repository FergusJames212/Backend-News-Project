const express = require('express');
const { getTopics } = require('./server/controllers/controllers.js');
const { handleStatus500 } = require('./server/controllers/error_handling_controllers.js');
const app = express();

app.get('/api/topics', getTopics);

app.use(handleStatus500);

module.exports = app;