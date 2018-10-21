const PubSub = require('../helpers/pub_sub.js');

const SelectCurrencyView = function(element, currency){
  this.element = element;
  this.currency = currency;
}

// SelectCurrencyView.prototype.bindEvents = function () {
//   PubSub.subscribe('Currencies:currencies-data-ready', (event) => {
//     console.log("from select currency view", event.detail);
//     allCurrencies = event.detail;
//     this.populate(allCurrencies);
//   })
// };

// SelectCurrencyView.prototype.populate = function (allCurrencies) {
//   allCurrencies.forEach((currency, index) => {
//     const option = document.createElement('option');
//     option.textContent = currency;
//     option.value = index;
//     this.element.appendChild(option);
//   })
// };

SelectCurrencyView.prototype.populate = function (index) {
  // console.log(index);
  const option = document.createElement('option');
  option.textContent = this.currency;
  option.value = index;
  this.element.appendChild(option);
};

module.exports = SelectCurrencyView;
