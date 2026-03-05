import { UserService } from "../../services/user.service";

describe("user service tests", () => {

  const service = new UserService();

  test("register user should require email", async () => {

    await expect(
      service.createUser({
        fullName: "Test",
        email: "",
        password: "12345678",
        confirmPassword: "12345678"
      } as any)
    ).rejects.toThrow();

  });



test("login should fail with empty password", async () => {
  const service = new UserService();

  await expect(
    service.loginUser("auth@test.com", "")
  ).rejects.toThrow();
});

});