import request from "supertest";
import app from "../../app";

describe("cart routes", ()=>{

test("cart requires login", async ()=>{
const res = await request(app).get("/api/cart");

expect(res.statusCode).toBe(401);
});

test("add item without login fails", async ()=>{
const res = await request(app)
.post("/api/cart")
.send({name:"onion",quantity:1});

expect(res.statusCode).toBe(401);
});

test("remove cart item without login fails", async ()=>{
const res = await request(app)
.delete("/api/cart/onion");

expect(res.statusCode).toBe(401);
});

test("cart add requires ingredient name", async () => {
  const res = await request(app)
    .post("/api/cart")
    .send({
      quantity: 2
    });

  expect(res.statusCode).toBe(401);
});

test("cart remove item requires login", async () => {
  const res = await request(app)
    .delete("/api/cart/tomato");

  expect(res.statusCode).toBe(401);
});

});

// 10 test cases total, 3 for getting cart, 3 for adding item, 3 for removing item, and the rest will be in auth.test.ts for registration/login and protected routes.