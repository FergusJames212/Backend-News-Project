const db = require("../../db/connection.js");

exports.fetchTopics = () => {
  let queryString = `
    SELECT * FROM topics;
    `;
  return db.query(queryString).then((res) => {
    return res.rows;
  });
};

exports.fetchArticles = () => {
  let queryString = `
    SELECT
    articles.article_id,
    title,
    topic,
    articles.author,
    articles.created_at,
    articles.votes,
    article_img_url,
    CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `;

  return db.query(queryString).then((res) => {
    return res.rows;
  });
};

exports.fetchArticlesById = (article_id) => {
  let queryString = `
  SELECT 
  articles.* ,
  CAST(COUNT(comment_id) AS INT) AS comment_count
  FROM articles
  JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  `;

  return db.query(queryString, [article_id]).then((res) => {
    if (res.rowCount === 0) {
      return Promise.reject("No article of that id found");
    }
    return res.rows[0];
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
    let queryString = 
    `
    UPDATE articles
    SET
    votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `;
    
    return db.query(queryString, [inc_votes, article_id])
    .then((res) => {
        return res.rows[0];
    });
};

exports.insertComment = (article_id, author, body) => {

    let queryString = 
    `
    INSERT INTO comments
    (article_id, author, body, votes)
    VALUES
    ($1, $2, $3, 0)
    RETURNING *;
    `;

    return db.query(queryString, [article_id, author, body]).then((res) => {
        return res.rows[0];
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  let queryString = `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `;

  return db.query(queryString, [article_id]).then((res) => {
    return res.rows;
  });
};

exports.fetchUsers = () => {
    let queryString = `
    SELECT * FROM users;
    `;
  return db.query(queryString).then((res) => {
    return res.rows;
  });
}