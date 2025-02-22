import { async } from "regenerator-runtime";
import { API_URL, API_KEY } from "./config.js";
import { getJSON } from "./helpers.js";

// export const loadSearch = async function (query) {
//   try {
//     // Format query correctly (remove spaces around commas)
//     const formattedQuery = query.replace(/\s*,\s*/g, ",").toLowerCase();

//     // Full list of meats and seafood to exclude by default
//     const allMeats = [
//       "chicken",
//       "beef",
//       "fish",
//       "seafood",
//       "lamb",
//       "turkey",
//       "duck",
//       "squid",
//       "shrimp",
//       "crab",
//       "lobster",
//       "salmon",
//       "tuna",
//       "pork",
//       "veal",
//       "goat",
//       "rabbit",
//     ];

//     // Split user's query into an array of ingredients
//     const userIngredients = formattedQuery.split(",");

//     // Find meats included in the query
//     const includedMeats = allMeats.filter((meat) =>
//       userIngredients.includes(meat)
//     );

//     // Exclude all meats **except** the ones the user specified
//     const excludedMeats = allMeats
//       .filter((meat) => !includedMeats.includes(meat))
//       .join(",");

//     // Construct API request
//     const searchData = await getJSON(
//       ${API_URL}?${API_KEY}&includeIngredients=${formattedQuery}&excludeIngredients=${excludedMeats}&number=10
//     );

//     const id = searchData.results.map((result) => result.id);
//     console.log(id);

//     const recipeData = id.map(async (id) => {
//       return await getJSON(
//         https://api.spoonacular.com/recipes/${id}/information?${API_KEY}&includeNutrition=false
//       );
//     });

//     console.log(recipeData);

//     console.log(searchData);

//     if (!searchData.results.length) throw new Error("No recipes found!");

//     state.recipe = searchData.results; // Update state with correct data
//     console.log(state.recipe);
//   } catch (err) {
//     console.log(err);
//   }
// };

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

// Validate if at least one user ingredient is in the recipe
const validateRecipe = (recipe, userIngredients) => {
  const recipeIngredients = recipe.extendedIngredients.map((ing) =>
    ing.name.toLowerCase()
  );
  return userIngredients.some((ing) => recipeIngredients.includes(ing));
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
