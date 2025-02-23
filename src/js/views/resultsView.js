import View from "./view.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".recipe--list");
  _errorMessage = "No recipes found for this ingredients. Please try again!";
  _btnBack = document.getElementById("btn--back");

  _generateMarkup() {
    if (!this._data || this._data.length === 0) return this.renderError();
    return this._data
      .map((data) => {
        return `
          <li class="recipe--item" id="${data.id}">
            <div class="recipe--imgContainer">
              <img src="${data.image || this._handleImageError}" alt="${
          data.title
        }" class="recipe--img" />
              <h1 class="recipe--title">${data.title}</h1>
            </div>
          </li>
        `;
      })
      .join(""); // Join to prevent adding commas between elements
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const recipeId = e.target.closest(".recipe--item").id;
      handler(recipeId);
    });
  }

  _handleImageError(e) {
    e.onerror = null;
    e.alt = "No Image Found"; // Change the alt text
  }
}
export default new ResultsView();
