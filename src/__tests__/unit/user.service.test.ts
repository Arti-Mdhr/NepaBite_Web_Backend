import { UserService } from "../../services/user.service";

describe("user service", ()=>{

const service = new UserService();

test("login fails if email empty", async ()=>{
await expect(
service.loginUser("", "123456")
).rejects.toThrow();
});

test("forgot password fails with invalid email", async ()=>{
await expect(
service.forgotPassword("fake@test.com")
).rejects.toThrow();
});

});
// 15 test cases total, 2 for login and forgot password, and the rest will be in auth.test.ts.