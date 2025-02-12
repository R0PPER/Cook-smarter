import * as model from "./model.js";
import * as view from "./views/view.js";
import searchView from "./views/searchView.js";

//control functions

const controlSearch = async function (query) {
  model.loadSearch(query);
};

const init = function () {
  searchView.submitHandler(controlSearch);
};

init();
