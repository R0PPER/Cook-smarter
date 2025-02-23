import { async } from "regenerator-runtime";
import { API_URL, API_KEY } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  recipe: [],
};

// List of meats to exclude by default
const allMeats = [
  "chicken",
  "beef",
  "fish",
  "seafood",
  "lamb",
  "turkey",
  "duck",
  "squid",
  "shrimp",
  "crab",
  "lobster",
  "salmon",
  "tuna",
  "pork",
  "veal",
  "goat",
  "rabbit",
];

// Format user input by removing spaces around commas
const formatQuery = (query) => query.replace(/\s*,\s*/g, ",").toLowerCase();

// Determine which meats to exclude
const getExcludedMeats = (userIngredients) => {
  const includedMeats = allMeats.filter((meat) =>
    userIngredients.includes(meat)
  );
  return allMeats.filter((meat) => !includedMeats.includes(meat)).join(",");
};

// Fetch search results from the API
const fetchSearchResults = async (query, excludedMeats) => {
  return await getJSON(
    `${API_URL}?${API_KEY}&includeIngredients=${query}&excludeIngredients=${excludedMeats}&number=10`
  );
};

// Fetch a single recipe's details
const fetchRecipeDetails = async (id) => {
  return await getJSON(
    `https://api.spoonacular.com/recipes/${id}/information?${API_KEY}&includeNutrition=false`
  );
};

// Validate if at least one user ingredient is found in the recipe (partial match)
const validateRecipe = (recipe, userIngredients) => {
  const recipeIngredients = recipe.extendedIngredients.map((ing) =>
    ing.name.toLowerCase()
  );

  return userIngredients.some((userIng) =>
    recipeIngredients.some((recipeIng) => recipeIng.includes(userIng))
  );
};

// Load search results and validate them
export const loadSearch = async function (query) {
  try {
    const formattedQuery = formatQuery(query);
    const userIngredients = formattedQuery.split(",");
    const excludedMeats = getExcludedMeats(userIngredients);

    const searchData = await fetchSearchResults(formattedQuery, excludedMeats);

    if (!searchData.results.length) throw new Error("No recipes found!");

    const validatedRecipes = await Promise.all(
      searchData.results.map(async (result) => {
        const recipe = await fetchRecipeDetails(result.id);
        return validateRecipe(recipe, userIngredients) ? recipe : null;
      })
    );

    state.recipe = validatedRecipes.filter((recipe) => recipe !== null);
    if (!state.recipe.length)
      throw new Error("No recipes found matching your ingredients!");

    console.log(state.recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Load a single recipe
export const loadRecipe = async function (id) {
  try {
    const recipeData = await fetchRecipeDetails(id);

    state.recipe = {
      title: recipeData.title,
      image: recipeData.image,
      ingredients: recipeData.extendedIngredients.map((ing) => ({
        name: ing.name,
        amount: ing.measures.metric.amount,
        metric: ing.measures.metric.unitShort,
      })),
      steps: recipeData.analyzedInstructions.length
        ? recipeData.analyzedInstructions[0].steps.map((step) => step.step)
        : ["No steps provided."],
      summary: recipeData.summary.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags
    };

    console.log(state.recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
