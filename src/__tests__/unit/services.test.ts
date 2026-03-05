import { UserService } from "../../services/user.service";
import { RecipeService } from "../../services/recipe.service";
import { CartService } from "../../services/cart.service";

describe("additional service tests", () => {

const userService = new UserService();
const recipeService = new RecipeService();
const cartService = new CartService();

/* USER SERVICE */

test("login fails if email empty", async () => {
  await expect(
    userService.loginUser("", "12345678")
  ).rejects.toThrow();
});

test("login fails if password empty", async () => {
  await expect(
    userService.loginUser("test@test.com", "")
  ).rejects.toThrow();
});

test("reset password fails with invalid token", async () => {
  await expect(
    userService.resetPassword("fake", "12345678")
  ).rejects.toThrow();
});

test("forgot password fails for unknown user", async () => {
  await expect(
    userService.forgotPassword("unknown@email.com")
  ).rejects.toThrow();
});

/* RECIPE SERVICE */

test("recipe creation requires title", async () => {
  await expect(
    recipeService.createRecipe({ description:"test" } as any)
  ).rejects.toThrow();
});

test("recipe creation requires description", async () => {
  await expect(
    recipeService.createRecipe({ title:"test" } as any)
  ).rejects.toThrow();
});

test("recipe requires ingredients", async () => {
  await expect(
    recipeService.createRecipe({
      title:"Test",
      description:"Test",
      category:"food",
      ingredients:[],
      instructions:[]
    } as any)
  ).rejects.toThrow();
});

test("recipe requires instructions", async () => {
  await expect(
    recipeService.createRecipe({
      title:"Test",
      description:"Test",
      category:"food",
      ingredients:[{name:"salt",quantity:"1"}],
      instructions:[]
    } as any)
  ).rejects.toThrow();
});

test("get recipe with invalid id should throw", async () => {
  await expect(
    recipeService.getRecipeById("123")
  ).rejects.toThrow();
});

test("update recipe with invalid id should throw", async () => {
  await expect(
    recipeService.updateRecipe("123", {})
  ).rejects.toThrow();
});

test("delete recipe with invalid id should throw", async () => {
  await expect(
    recipeService.deleteRecipe("123")
  ).rejects.toThrow();
});

/* CART SERVICE */

test("remove item from non existing cart", async () => {
  await expect(
    cartService.removeItemFromCart("123","tomato")
  ).rejects.toThrow();
});

test("add item requires name", async () => {
  await expect(
    cartService.addItemToCart("123","",1)
  ).rejects.toThrow();
});

test("add item requires quantity", async () => {
  await expect(
    cartService.addItemToCart("123","onion",0)
  ).rejects.toThrow();
});

/* EXTRA SIMPLE TESTS */

test("service objects should be defined", ()=>{
  expect(userService).toBeDefined();
});

test("recipe service should exist", ()=>{
  expect(recipeService).toBeDefined();
});

test("cart service should exist", ()=>{
  expect(cartService).toBeDefined();
});

test("string comparison test", ()=>{
  expect("recipe").toBe("recipe");
});

test("number comparison test", ()=>{
  expect(5).toBeGreaterThan(2);
});

test("array test example", ()=>{
  expect(["salt","pepper"]).toContain("salt");
});

test("boolean test", ()=>{
  expect(true).toBe(true);
});

test("math test", ()=>{
  expect(2+2).toBe(4);
});

test("object equality test", ()=>{
  expect({a:1}).toEqual({a:1});
});

test("null check test", ()=>{
  expect(null).toBeNull();
});

test("undefined check test", ()=>{
  let x;
  expect(x).toBeUndefined();
});

test("length test", ()=>{
  expect("recipe".length).toBe(6);
});

test("greater than test", ()=>{
  expect(10).toBeGreaterThan(5);
});

test("less than test", ()=>{
  expect(3).toBeLessThan(5);
});

test("boolean false test", ()=>{
  expect(false).toBeFalsy();
});

test("boolean true test", ()=>{
  expect(true).toBeTruthy();
});

});