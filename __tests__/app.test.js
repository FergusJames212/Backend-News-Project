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
  it("200: responds with an array of article objects, each containing author, title, article id, topic, creation time, votes, and article image url properties. Each object should also have a comment count property, calculated using queries. The articles should be ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
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
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe.only("GET /api/articles/:id", () => {
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
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles.length).toBe(1);
        expect(body.articles[0]).toEqual(article);
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

// Miss read question so started this early but would like to keep as might be useful for task 10 please ignore for now

/*
it("200: filters results when an article_id search query is added to the path", () => {
  const article = {
    article_id: 1,
    title: "Living in the shadow of a great man",
    topic: "mitch",
    author: "butter_bridge",
    created_at: "2020-07-09T20:11:00.000Z",
    votes: 100,
    article_img_url:
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    comment_count: 11,
  };

  return request(app)
    .get("/api/articles?search=1")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toBeInstanceOf(Array);
      expect(body.articles.length).toBe(1);
      expect(body.articles[0]).toEqual(article);
    });
});

it("400: returns a 400 error when given a query that isn't a valid article_id", () => {
  return request(app)
    .get("/api/articles?search=not-valid-id")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid article_id");
    });
});
*/
