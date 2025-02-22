//render(data)
//_data
//update
//clear
//renderspinner
//render error
//render message

export default class View {
  _data;

  render(data) {
    if (!data || data.length === 0) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    if (this._parentElement.tagName === "INPUT") {
      this._parentElement.value = "";
    } else {
      this._parentElement.innerHTML = "";
    }
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <div class="spinner-inner"></div>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  toggleContainers(mainSelector, resultsSelector) {
    const mainContainer = document.querySelector(mainSelector);
    const resultsContainer = document.querySelector(resultsSelector);

    if (!mainContainer || !resultsContainer) return;

    const isResultsVisible = resultsContainer.style.display === "flex";

    mainContainer.style.display = isResultsVisible ? "flex" : "none";
    resultsContainer.style.display = isResultsVisible ? "none" : "flex";
  }
}
