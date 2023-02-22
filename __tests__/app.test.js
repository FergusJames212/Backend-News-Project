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
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
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

describe("POST /api/articles/:article_id/comments", () => {
  
  it("201: accepts an object with username and body properties and fills out all other properties, responding with the full posted comment", () => {
    const comment = {
      author: "butter_bridge",
      body: "my comment"
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        console.log(body, "test body")
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
});