import request from "supertest";
import app from "../../app";

describe("saved recipes routes", ()=>{

test("get saved recipes requires login", async ()=>{
const res = await request(app)
.get("/api/saved-recipes");

expect(res.statusCode).toBe(401);
});

test("save recipe requires login", async ()=>{
const res = await request(app)
.post("/api/saved-recipes/save")
.send({recipeId:"123"});

expect(res.statusCode).toBe(401);
});

test("remove saved recipe requires login", async ()=>{
const res = await request(app)
.delete("/api/saved-recipes/remove/123");

expect(res.statusCode).toBe(401);
});

test("saving recipe without id fails", async () => {
  const res = await request(app)
    .post("/api/saved-recipes/save")
    .send({});

  expect(res.statusCode).toBe(401);
});

test("removing recipe without login fails", async () => {
  const res = await request(app)
    .delete("/api/saved-recipes/remove/123");

  expect(res.statusCode).toBe(401);
});

});

// 8 test cases total, 3 for getting saved recipes, 3 for saving recipe, 2 for removing saved recipe, and the rest will be in auth.test.ts for registration/login and protected routes.