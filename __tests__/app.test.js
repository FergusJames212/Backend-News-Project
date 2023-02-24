const request = require("supertest");

const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data");
const db = require("../db/connection.js");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("ANY /api/invalid-path", () => {
  it("404: responds with an error informing the user an invalid path has been given", () => {
    return request(app)
      .get("/api/invalid-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/topics", () => {
  it("200: responds with an array of topic objects, each containing a slug and a description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics.length).toBeGreaterThan(0);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  it("200: responds with an array of article objects, each containing author, title, article id, topic, creation time, votes, and article image url properties.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  it("200: should also have a comment count property, calculated using queries. The articles should be ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:id", () => {
  const article = {
    author: "butter_bridge",
    title: "Living in the shadow of a great man",
    article_id: 1,
    body: "I find this existence challenging",
    topic: "mitch",
    created_at: "2020-07-09T20:11:00.000Z",
    votes: 100,
    article_img_url:
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
  };

  it("200: responds with a single article object inside an array with matching article_id to :id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Array);
        expect(body.article.length).toBe(1);
        expect(body.article[0]).toEqual(article);
      });
  });

  it("400: returns an error when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  it("404: returns an error when given a valid article_id but there is no article with that id", () => {
    return request(app)
      .get("/api/articles/22")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article of that id found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds with an array of comment objects containing the following properties; comment_id, votes, created_at, author, body & article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments.length).toBeGreaterThan(0);
        expect(
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
            expect(comment.article_id).toBe(3);
          })
        );
      });
  });

  it("200: comments should return most recently posted first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  it("200: returns an empty array when given a valid article_id but there is no comments on that article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments.length).toBe(0);
      });
  });

  it("400: returns an error when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  it("404: returns an error when given a valid article_id but no article with that id exists", () => {
    return request(app)
      .get("/api/articles/50/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article of that id found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: accepts an object with username and body properties and fills out all other properties, responding with the full posted comment", () => {
    const comment = {
      author: "butter_bridge",
      body: "my comment",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toBeInstanceOf(Object);
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.body).toBe("my comment");
        expect(body.comment).toMatchObject({
          article_id: expect.any(Number),
          comment_id: expect.any(Number),
          body: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  it("400: throws an error when object provided is missing info that should fill not null columns in table", () => {
    const comment = {
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Not null violation");
      });
  });

  it("400: throws an error when article_id provided is invalid", () => {
    const comment = {
      author: "butter_bridge",
      body: "my comment",
    };
    return request(app)
      .post("/api/articles/bananas/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  it("404: throws an error when article_id provided is valid but no article with that id exists", () => {
    const comment = {
      author: "butter_bridge",
      body: "my comment",
    };
    return request(app)
      .post("/api/articles/50/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Foreign key violation");
      });
  });

  it("400: throws error when request made to valid article_id but username is not in username table", () => {
    const comment = {
      author: "fergus",
      body: "my comment",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Foreign key violation");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: accepts an object with property inc_votes and increments the article with :article_id by that much, returning the updated article", () => {
    const inc_votes = { inc_votes: 2 };

    const article = {
      author: "butter_bridge",
      title: "Living in the shadow of a great man",
      article_id: 1,
      body: "I find this existence challenging",
      topic: "mitch",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 102,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(article);
      });
  });

  it("400: returns an error when given an incorrect data type in the object", () => {
    const inc_votes = { inc_votes: "banana" };

    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });

  it("400: returns an error when given an incorrect data type in the article_id", () => {
    const inc_votes = { inc_votes: 2 };

    return request(app)
      .patch("/api/articles/not-a-number")
      .send(inc_votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });

  it("404: returns an error when given an article_id of the correct form but no such id exists", () => {
    const inc_votes = { inc_votes: 2 };

    return request(app)
      .patch("/api/articles/50")
      .send(inc_votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No article of that id found");
      });
  });
});

describe("GET /api/users", () => {
  it("200: returns an array of all user objects, each containing a username, name & avatar_url property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      });
  });
});
