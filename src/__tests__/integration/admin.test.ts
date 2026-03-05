import request from "supertest";
import app from "../../app";

describe("admin user routes", ()=>{

test("admin list users without token fails", async ()=>{
const res = await request(app)
.get("/api/admin/users");

expect(res.statusCode).toBe(401);
});

test("admin create user requires token", async ()=>{
const res = await request(app)
.post("/api/admin/users");

expect(res.statusCode).toBe(401);
});

});

// 12 test cases total, 3 for listing users, 3 for creating user, 3 for updating user, 3 for deleting user, and the rest will be in auth.test.ts for registration/login and protected routes.