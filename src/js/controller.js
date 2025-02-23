import * as model from "./model.js";
import View from "./views/view.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import instructionsView from "./views/instructionsView.js";

//control functions

const controlSearch = async function (query) {
  try {
    // Render spinner
    resultsView.renderSpinner();

    // Load search
    await model.loadSearch(query);

    // Render results
    resultsView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
  }
};

const controlUsersPick = async function (id) {
  try {
    // Render spinner
    instructionsView.renderSpinner();

    // Load recipe
    await model.loadRecipe(id);

    // Render Instructions
    instructionsView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  searchView.submitHandler(controlSearch);
  instructionsView._goBackHandler();
  resultsView.addHandlerRender(controlUsersPick);
};

init();
