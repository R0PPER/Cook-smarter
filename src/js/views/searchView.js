import View from "./view.js";

class SearchView extends View {
  _parentElement = document.getElementById("search--input");
  _errorMessage = "No recipes found for this ingredients. Please try again!";

  submitHandler = function (handler) {
    this._parentElement.addEventListener("keydown", (e) => {
      const query = this._parentElement.value.toLowerCase().trim();

      if (e.key === "Enter") {
        this._clear();
        handler(query);
      }
    });
  };
}

export default new SearchView();
