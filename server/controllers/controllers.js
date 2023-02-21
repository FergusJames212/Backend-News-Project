const { fetchTopics, fetchArticles, fetchArticlesById } = require("../models/models.js");

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
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err);
    });
};