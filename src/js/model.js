import { async } from "regenerator-runtime";
import { API_URL, API_KEY } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  recipe: {},
};

export const loadSearch = async function (query) {
  try {
    const searchData = await getJSON(
      `${API_URL}?${API_KEY}&ingredients=${query}`
    );

    console.log(searchData);

    if (!searchData.length) throw new Error("No recipes found!");

    state.recipe = searchData;

    console.log(state.recipe);

    // const recipeId = searchData[0].id;
    // loadRecipe(recipeId);
  } catch (err) {
    console.log(err);
  }
};

export const loadRecipe = async function (id) {
  try {
    const recipeData = await getJSON(
      `https://api.spoonacular.com/recipes/${id}/information?${API_KEY}&includeNutrition=false`
    );

    state.recipe = {
      title: recipeData.title,
      image: recipeData.image,
      ingredients: recipeData.extendedIngredients.map((ing) => ({
        name: ing.name,
        amount: ing.measures.metric.amount,
        metric: ing.measures.metric.unitShort
          ? ing.measures.metric.unitShort
          : "unit",
      })),
      steps: recipeData.analyzedInstructions.length
        ? recipeData.analyzedInstructions[0].steps.map((step) => step.step)
        : ["No steps provided."],
      summary: recipeData.summary.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags
    };

    console.log(state.recipe);
  } catch (err) {
    console.log(err);
  }
};
