const express = require('express');
const { getTopics, getArticles, getArticlesById, patchArticleById } = require('./server/controllers/controllers.js');
const { handleStatus500, handlePSQL400, handleCustomErrors } = require('./server/controllers/error_handling_controllers.js');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:id', getArticlesById);

app.patch('/api/articles/:article_id', patchArticleById);

app.use(handlePSQL400);
app.use(handleCustomErrors);
app.use(handleStatus500);

module.exports = app;