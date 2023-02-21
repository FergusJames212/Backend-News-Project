const express = require("express");
const {
  getTopics,
  getArticles,
  getArticlesById,
  getCommentsByArticleId,
} = require("./server/controllers/controllers.js");
const {
  handleStatus500,
  handlePSQL400,
  handleCustomErrors,
} = require("./server/controllers/error_handling_controllers.js");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(handlePSQL400);
app.use(handleCustomErrors);
app.use(handleStatus500);

module.exports = app;
