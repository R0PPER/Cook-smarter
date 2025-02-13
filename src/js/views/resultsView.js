import View from "./view.js";

class ResultsView extends View {
  _parentElement = document.getElementById("results--container");
  _errorMessage = "No recipes found for this ingredients. Please try again!";

  _generateMarkup() {
    return `
      <div class="results">
        <h2>Results</h2>
        <ul class="results__list">
        
        </ul>
      </div>
    `;
  }
}

export default new ResultsView();
