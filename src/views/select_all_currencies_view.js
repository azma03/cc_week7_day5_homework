const PubSub = require('../helpers/pub_sub.js');
const SelectCurrencyView = require('./select_currency_view.js');

const SelectAllCurrenciesView = function(container){
  this.container = container;
}

SelectAllCurrenciesView.prototype.bindEvents = function () {
  PubSub.subscribe('Currencies:currencies-data-ready', (event) => {
    this.currencies = event.detail;
    this.populate();
  })

  const form = document.querySelector('#form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log("Form submit event", event);
    // debugger;
    console.log("Form submit event", event.target.amount.value);
    PubSub.publish('SelectAllCurrenciesView:form-submitted', event.target);
  });
};

SelectAllCurrenciesView.prototype.populate = function () {
  console.log("from select all currencies view", this.currencies);
  console.log("from select all currencies view", this.container);

  //get all the select elements in the div
  const elements = this.container.querySelectorAll(".currencySelector")
  // debugger;
  elements.forEach((selectElement) => {
    this.currencies.forEach((currency, index) => {
      const selectCurrencyView = new SelectCurrencyView(selectElement, currency);
      selectCurrencyView.populate(index);  //send the index to use for option.value
    })

  })

};

module.exports = SelectAllCurrenciesView;
