const db= require('../db/connection.js');
const seed= require('../db/seeds/seed.js');
const data= require('../db/data/test-data');
const request= require('supertest');
const app = require('../app.js');
const { response } = require('../app.js');

beforeEach(()=>seed(data))
afterAll(()=>{
    db.end()
})

describe('/api/topics',()=>{
    test('GET-200 - Should response with an array of topics',()=>{
        return request(app).get('/api/topics').then((response)=>{
            expect(response.status).toBe(200)
            const topics= response.body.topics
            expect(Array.isArray(topics)).toBe(true)
            expect(topics.length).toBe(3)
            topics.forEach((topic)=>{
                 expect(topic).toMatchObject({
                     slug: expect.any(String), 
                     description: expect.any(String)
                 })
            })
        })
    })
    test('GET-404 - Returns a not found message when the topic does not exist',()=>{

        return request(app)
        .get('/api/topi')
        .expect(404)
        .then((result)=>{ 
            expect(result.body.msg).toBe("not found")
        })
    })
    
})

describe('/api/articles/:article_id',()=>{
    test('GET-200 - Should responds with an object of article',()=>{
        return request(app).get('/api/articles/9')
        .expect(200)
        .then(({body})=>{
            const singleArticle={
                article_id: 9,
                title: "They're not exactly dogs, are they?",
                topic: "mitch",
                author: "butter_bridge",
                body: "Well? Think about it.",
                created_at:  "2020-06-06T09:10:00.000Z",
                votes: 0,
              }

            expect(body).toEqual(singleArticle)
        })
    })
    test('GET-404 - Returns a not found message when the article does not exist',()=>{
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then((result)=>{
          expect(result.body.msg).toBe("not found")
        })
  })
  test("GET-400 - Responds with status code 400 and msg 'bad request' when entering wrong data type for article_id", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
}); 

describe("PATCH /api/articles/:article_id", () => {
    test("200:return the updated vote in the response body", () => {
      const reqBody = { inc_votes: -20 };
      return request(app)
        .patch("/api/articles/1")
        .send(reqBody)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(1);
          expect(body.article.votes).toBe(80);
        })
    })

    test("200:return the updated vote in the response body", () => {
      const reqBody = { inc_votes: 20 };
      return request(app)
        .patch("/api/articles/2")
        .send(reqBody)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(2);
          expect(body.article.votes).toBe(20);
        })
    })

    test("404: when provided with a valid but non-existent article id", () => {
      const reqBody = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1000")
        .send(reqBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });

    test("400: returns bad request error message when called with an article id of wrong data type", () => {
      const reqBody = { inc_votes: 7 };
         return request(app)
        .patch("/api/articles/bananas")
        .send(reqBody)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid input");
        });
    });
});

describe('/api/users', () => {
  test('GET-200 - Should response with an array of object and each of them should have username property', () => {
    return request(app).get('/api/users')
    expect(200)
    .then((response)=>{
      expect(response.body.users).toHaveLength(4);
      expect(response.body.users).toBeInstanceOf(Array);
      response.body.users.forEach((user) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
      });
    });
  });
  test('GET-404 - Returns a not found message when the users does not exist',()=>{

    return request(app)
    .get('/api/user')
    .expect(404)
    .then((result)=>{ 
        expect(result.body.msg).toBe("not found")
    })
})
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should respond with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("400: Should return a status code of 400 when an incorrect data type is passed into the endpoint", () => {
    return request(app)
      .get("/api/articles/apple/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });

})

describe("GET /api/articles",()=>{
  test("200: should return all articles including comment count",()=>{
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((result)=>{
      expect(result.body.result).toEqual(expect.any(Array));
      expect(result.body.result).toHaveLength(12);
      expect(typeof result.body.result[0]).toEqual("object");
      expect.objectContaining({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(String),
      });
    });
});
});








     
  


  




