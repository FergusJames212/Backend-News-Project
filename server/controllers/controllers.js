const {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  insertComment,
  fetchCommentsByArticleId,
  updateArticleById,
} = require("../models/models.js");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const article_id = req.params.id;
  fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const inc_votes = req.body.inc_votes;

  updateArticleById(article_id, inc_votes)
    .then((article) => {
      if (typeof { article }.article === "undefined") {
        return Promise.reject("No article of that id found");
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  const article_id = req.params.article_id;
  const { author, body } = req.body;
  insertComment(article_id, author, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;

  const articleCheck = fetchArticlesById(article_id);
  const commentsPromise = fetchCommentsByArticleId(article_id);

  Promise.all([commentsPromise, articleCheck])
    .then((response) => {
      comments = response[0];
      article = response[1];
      if (article.length === 0) {
        return Promise.reject("No article of that id found");
      }
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
