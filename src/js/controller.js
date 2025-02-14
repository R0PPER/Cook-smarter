import * as model from "./model.js";
import View from "./views/view.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import instructionsView from "./views/instructionsView.js";

//control functions

const controlSearch = async function (query) {
  try {
    await model.loadSearch(query);

    // Render results
    resultsView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
};

const controlUsersPick = async function (id) {
  try {
    await model.loadRecipe(id);

    // Render Instructions
    instructionsView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  searchView.submitHandler(controlSearch);
  resultsView._goBackHandler();
  resultsView.addHandlerRender(controlUsersPick);
};

init();
