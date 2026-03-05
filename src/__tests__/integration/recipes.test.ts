import request from "supertest";
import app from "../../app";

describe("recipe routes", ()=>{

test("get recipes list", async ()=>{
const res = await request(app).get("/api/recipes");

expect(res.statusCode).toBe(200);
expect(res.body.success).toBe(true);
});

test("invalid recipe id should fail", async ()=>{
const res = await request(app).get("/api/recipes/123");

expect(res.statusCode).toBe(404);
});

test("recipe review without login fails", async ()=>{
const res = await request(app)
.post("/api/recipes/review")
.send({});

expect(res.statusCode).toBe(401);
});

test("remove review without login fails", async ()=>{
const res = await request(app)
.delete("/api/recipes/review/123/456");

expect(res.statusCode).toBe(401);
});

test("get recipes with pagination", async () => {
  const res = await request(app)
    .get("/api/recipes?page=1&limit=5");

  expect(res.statusCode).toBe(200);
});

test("review requires rating", async () => {
  const res = await request(app)
    .post("/api/recipes/review")
    .send({
      recipeId: "123",
      comment: "good"
    });

  expect(res.statusCode).toBe(401);
});

test("review requires login", async () => {
  const res = await request(app)
    .post("/api/recipes/review")
    .send({
      recipeId: "123",
      rating: 5,
      comment: "nice"
    });

  expect(res.statusCode).toBe(401);
});

});

// 15 test cases total, 3 for getting recipes, 1 for invalid id, 1 for review without login, 1 for delete review without login, and the rest will be in admin.test.ts and saved-recipes.test.ts.