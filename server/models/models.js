const db = require("../../db/connection.js");

exports.fetchTopics = () => {
  let queryString = `
    SELECT * FROM topics;
    `;
  return db.query(queryString).then((res) => {
    return res.rows;
  });
};

exports.fetchArticles = (queries) => {
  let filterSQL = ``;
  const queryValues = [];
  if (queries.topic) {
    filterSQL += `WHERE articles.topic = $1`;
    queryValues.push(queries.topic);
  }

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
    CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    ` +
    filterSQL +
    `
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `;

  return db.query(queryString, queryValues).then((res) => {
    console.log(res.rows);
    return res.rows;
  });
};

// if (queries.topic) {
//     const filterColumn = queries.topic
//       ? format(`%I`, queries.topic)
//       : "topic";
//     filterSQL += `WHERE articles.topic = ${filterColumn}`;
//   }

// const queryArgs = queries.topic ? [queryString, [queries.topic]]:[queryString];
