import View from "./view.js";

class SearchView extends View {
  _parentElement = document.getElementById("search--input");
  _errorMessage = "No recipes found for these ingredients. Please try again!";

  submitHandler(handler) {
    this._parentElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = this._parentElement.value.toLowerCase().trim();
        if (!query) return; // Stop if input is empty

        this.toggleContainers("#main--container", "#results--container");
        this._clear();
        handler(query);
      }
    });
  }
}

export default new SearchView();
