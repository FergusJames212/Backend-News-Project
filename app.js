const express = require('express');
const { getTopics, getArticles, getArticlesById, postComment } = require('./server/controllers/controllers.js');
const { handleInvalidPath, handleStatus500, handlePSQL400, handleCustomErrors } = require('./server/controllers/error_handling_controllers.js');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:id', getArticlesById);

app.post('/api/articles/:article_id/comments', postComment);

app.all('*', handleInvalidPath);

app.use(handlePSQL400);
app.use(handleCustomErrors);
app.use(handleStatus500);

module.exports = app;