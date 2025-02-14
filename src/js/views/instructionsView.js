import View from "./view.js";

class InstructionsView extends View {
  _parentElement = document.getElementById("description--container");
  _errorMessage = "No recipes found for these ingredients. Please try again!";

  _generateMarkup() {
    return `
      <h1 class="description--title">Step by step</h1>
      <ul class="description--text">
        ${this._data.steps.map((step) => `<li>${step}</li>`).join("")}
      </ul>
      <h1 class="description--title">What you need</h1>
      <ul class="description--list">
        ${this._data.ingredients
          .map((ing) => `<li>${ing.amount} ${ing.metric} ${ing.name}</li>`)
          .join("")}
      </ul>
    `;
  }
}

export default new InstructionsView();
