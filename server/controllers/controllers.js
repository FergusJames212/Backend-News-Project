const { fetchTopics, fetchArticles } = require("../models/models.js");

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
    queries = req.query; 
    // getTopics
    const topicsCheck = fetchTopics()
    const fetchedArticles = fetchArticles(queries)
    
    Promise.all([topicsCheck, fetchedArticles])
    .then((response) => {
        const topicObjects = response[0];
        // if (topicObjects.find(topic => topic.slug === queries.topic)) {
        //     return Promise.reject("That topic doesn't exist")
        // }
        const articles = response[1];
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err);
    });
};