import { RecipeService } from "../../services/recipe.service";

describe("recipe service", ()=>{

const service = new RecipeService();

test("recipe requires title", async ()=>{
await expect(
service.createRecipe({description:"test"} as any)
).rejects.toThrow();
});

test("recipe requires ingredients", async ()=>{
await expect(
service.createRecipe({
title:"Test",
description:"test",
category:"food",
ingredients:[],
instructions:[]
} as any)
).rejects.toThrow();
});

});