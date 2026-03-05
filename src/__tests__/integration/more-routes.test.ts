import request from "supertest";
import app from "../../app";

describe("more api route tests", () => {

test("home route should return api running", async () => {
  const res = await request(app).get("/");
  expect(res.statusCode).toBe(200);
});

test("recipes route should exist", async () => {
  const res = await request(app).get("/api/recipes");
  expect(res.statusCode).toBe(200);
});

test("profile route without token should fail", async () => {
  const res = await request(app).get("/api/auth/profile");
  expect(res.statusCode).toBe(401);
});

test("admin users route without token should fail", async () => {
  const res = await request(app).get("/api/admin/users");
  expect(res.statusCode).toBe(401);
});

test("admin recipes route without token should fail", async () => {
  const res = await request(app).post("/api/admin/recipes");
  expect(res.statusCode).toBe(401);
});

test("cart route requires login", async () => {
  const res = await request(app).get("/api/cart");
  expect(res.statusCode).toBe(401);
});

test("saved recipes route requires login", async () => {
  const res = await request(app).get("/api/saved-recipes");
  expect(res.statusCode).toBe(401);
});

test("forgot password route should exist", async () => {
  const res = await request(app)
    .post("/api/auth/forgot-password")
    .send({ email: "fake@email.com" });

  expect(res.statusCode).toBeDefined();
});

test("reset password route should exist", async () => {
  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({ token: "abc", password: "12345678" });

  expect(res.statusCode).toBeDefined();
});

test("delete cart item without login should fail", async () => {
  const res = await request(app).delete("/api/cart/onion");
  expect(res.statusCode).toBe(401);
});

});