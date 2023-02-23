const { fetchTopics, fetchArticles, fetchArticlesById, updateArticleById } = require("../models/models.js");

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

exports.patchArticleById = (req, res, next) => {
    const article_id = req.params.article_id;
    const inc_votes = req.body.inc_votes;

    updateArticleById(article_id, inc_votes)
    .then((article) => {
        if (typeof { article }.article === "undefined") {
            return Promise.reject("No article of that id found");
        };
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    });
};