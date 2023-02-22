const { fetchTopics, fetchArticles, fetchArticlesById, insertComment } = require("../models/models.js");

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

exports.postComment = (req, res, next) => {
    const article_id = req.params.article_id;
    const { author, body } = req.body;
    insertComment(article_id, author, body)
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err);
    });
};