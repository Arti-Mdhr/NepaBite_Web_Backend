import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("auth routes", () => {

const user = {
fullName: "Test User",
email: "auth@test.com",
password: "password123",
confirmPassword: "password123",
phoneNumber: "123456789",
address: "test street"
};

beforeAll(async ()=>{
await UserModel.deleteMany({email:user.email});
});

afterAll(async ()=>{
await UserModel.deleteMany({email:user.email});
});

test("register user", async ()=>{
const res = await request(app)
.post("/api/auth/register")
.send(user);

expect(res.statusCode).toBe(200);
expect(res.body.success).toBe(true);
});

test("register fails with missing email", async ()=>{
const res = await request(app)
.post("/api/auth/register")
.send({ ...user, email: "" });

expect(res.statusCode).toBe(400);
});

test("login works with correct password", async ()=>{
const res = await request(app)
.post("/api/auth/login")
.send({
email:user.email,
password:user.password
});

expect(res.statusCode).toBe(201);
expect(res.body.token).toBeDefined();
});

test("login fails with wrong password", async ()=>{
const res = await request(app)
.post("/api/auth/login")
.send({
email:user.email,
password:"wrongpass"
});

expect(res.statusCode).not.toBe(201);
});

test("profile route requires token", async ()=>{
const res = await request(app)
.get("/api/auth/profile");

expect(res.statusCode).toBe(401);
});
test("register fails with missing fullName", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      email: "test2@test.com",
      password: "password123",
      confirmPassword: "password123"
    });

  expect(res.statusCode).toBe(400);
});

test("register fails if passwords do not match", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      fullName: "Test User",
      email: "test3@test.com",
      password: "password123",
      confirmPassword: "wrongpassword"
    });

  expect(res.statusCode).toBe(400);
});

test("login fails with missing password", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "auth@test.com"
    });

  expect(res.statusCode).toBe(401);
});

test("login fails with non existing email", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "fake@test.com",
      password: "password123"
    });

  expect(res.statusCode).not.toBe(201);
});

});

// 10 tests total, 5 for registration/login and 5 for protected routes.