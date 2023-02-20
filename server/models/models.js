const db = require("../../db/connection.js");

exports.fetchTopics = () => {
    let queryString = 
    `
    SELECT * FROM topics;
    `
    return db.query(queryString)
    .then((res) => {
        return res.rows;
    });
};

exports.fetchArticles = () => {
    let queryString = 
    `
    SELECT
    articles.article_id,
    title,
    topic,
    articles.author,
    articles.created_at,
    articles.votes,
    article_img_url,
    COUNT(comment_id) AS comment_count
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `
    return db.query(queryString)
    .then((res) => {
        return res.rows;
    });
};