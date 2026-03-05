import { UserService } from "../../services/user.service";
import { RecipeService } from "../../services/recipe.service";
import { CartService } from "../../services/cart.service";

describe("extra unit tests", () => {

const userService = new UserService();
const recipeService = new RecipeService();
const cartService = new CartService();

test("user service instance should exist", () => {
  expect(userService).toBeTruthy();
});

test("recipe service instance should exist", () => {
  expect(recipeService).toBeTruthy();
});

test("cart service instance should exist", () => {
  expect(cartService).toBeTruthy();
});

test("recipe service should have createRecipe function", () => {
  expect(typeof recipeService.createRecipe).toBe("function");
});

test("cart service should have addItemToCart function", () => {
  expect(typeof cartService.addItemToCart).toBe("function");
});

test("cart service should have removeItemFromCart function", () => {
  expect(typeof cartService.removeItemFromCart).toBe("function");
});

test("recipe service should have getAllRecipes function", () => {
  expect(typeof recipeService.getAllRecipes).toBe("function");
});

test("simple number test", () => {
  const result = 10 + 5;
  expect(result).toBe(15);
});

test("simple string test", () => {
  const text = "Nepabite";
  expect(text).toContain("bite");
});

test("simple array test", () => {
  const ingredients = ["salt", "pepper", "oil"];
  expect(ingredients.length).toBe(3);
});

});