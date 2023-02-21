const { fetchTopics, fetchArticles, fetchArticlesById, fetchCommentsByArticleId } = require("../models/models.js");

exports.getTopics = (req, res, next) => {    
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
    const article_id = req.params.id;
    fetchArticlesById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
    const article_id = req.params.article_id;
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        console.log(comments, "comments")
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err);
    });
};