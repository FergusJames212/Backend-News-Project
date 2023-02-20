const { fetchTopics } = require("../models/models.js");

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        // console.log(topics, "<< topics")
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err);
    });
};