const {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  insertComment,
  fetchCommentsByArticleId,
  updateArticleById,
  fetchUsers,
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
    if (req.query.hasOwnProperty("sort_by")) {
        
        const validSortBy = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "article_img_url"];

            if (!validSortBy.find(column => column === req.query.sort_by)) {
                next("That column doesn't exist");
            };
    };

    if (req.query.hasOwnProperty("order")) {
        
        const validOrder = ["ASC", "DESC"];

            if (!validOrder.find(option => option === req.query.order.toUpperCase())) {
                next("Invalid order");
            };
    };

    queries = req.query; 
    
    const topicsCheck = fetchTopics()
    const fetchedArticles = fetchArticles(queries)
    
    Promise.all([topicsCheck, fetchedArticles])
    .then((response) => {
        const topicObjects = response[0];
        const articles = response[1];

        if(req.query.hasOwnProperty("topic")) {
            if (typeof topicObjects.find(topic => topic.slug === queries.topic) !== "object") {
                return Promise.reject("That topic doesn't exist")
            }
        }
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const article_id = req.params.article_id;
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
      if (Object.keys(article).length === 0) {
        return Promise.reject("No article of that id found");
      }
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
