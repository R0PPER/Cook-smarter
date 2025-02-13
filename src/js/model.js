import { async } from "regenerator-runtime";
import { API_URL, API_KEY } from "./config.js";

export const state = {};

export const loadSearch = async function (query) {
  try {
    const res = await fetch(`${API_URL}?${API_KEY}&ingredients=${query}`);
    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(`Something went wrong! (${res.status})`);

    const recipeId = data[0].id;
    const recipeResponse = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?${API_KEY}&includeNutrition=false`
    );

    if (!recipeResponse.ok) {
      throw new Error(`Something went wrong! ${recipeResponse.status}`);
    }

    const recipeData = await recipeResponse.json();
    console.log(recipeData);

    // console.log(query);
  } catch (err) {
    console.log(err);
  }
};
