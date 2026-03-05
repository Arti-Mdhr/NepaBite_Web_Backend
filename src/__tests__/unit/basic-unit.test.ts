import { UserService } from "../../services/user.service";
import { RecipeService } from "../../services/recipe.service";
import { CartService } from "../../services/cart.service";

describe("basic extra unit tests", () => {

const userService = new UserService();
const recipeService = new RecipeService();
const cartService = new CartService();

test("user service should be an object", () => {
  expect(typeof userService).toBe("object");
});

test("recipe service should be an object", () => {
  expect(typeof recipeService).toBe("object");
});

test("cart service should be an object", () => {
  expect(typeof cartService).toBe("object");
});

test("recipe service should contain updateRecipe method", () => {
  expect(recipeService.updateRecipe).toBeDefined();
});

test("recipe service should contain deleteRecipe method", () => {
  expect(recipeService.deleteRecipe).toBeDefined();
});

test("cart service should contain getCartByUserId method", () => {
  expect(cartService.getCartByUserId).toBeDefined();
});

test("cart service should contain addItemToCart method", () => {
  expect(cartService.addItemToCart).toBeDefined();
});

test("basic math check", () => {
  expect(5 * 2).toBe(10);
});

test("string should match expected value", () => {
  const name = "nepabite";
  expect(name).toBe("nepabite");
});

test("array should contain ingredient", () => {
  const ingredients = ["salt", "pepper", "garlic"];
  expect(ingredients).toContain("salt");
});

});