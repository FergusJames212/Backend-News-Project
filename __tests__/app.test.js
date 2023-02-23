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
              article_id: expect.any(Number)
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