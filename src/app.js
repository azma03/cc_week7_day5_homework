const Currencies = require('./models/currencies.js');
const SelectAllCurrenciesView = require('./views/select_all_currencies_view.js');
const DisplayExchangeAmount = require('./views/display_exchange_amount.js');
const DisplayAreaChart = require('./views/display_area_chart.js');

document.addEventListener('DOMContentLoaded', () => {
  console.log('JavaScript Loaded');

  const areaChartContainer = document.querySelector('#areaChart');
  const displayAreaChart = new DisplayAreaChart(areaChartContainer);
  displayAreaChart.bindEvents();

  const exchangeAmountContainer = document.querySelector('#exchangeAmountDiv');
  const displayExchangeAmount = new DisplayExchangeAmount(exchangeAmountContainer);
  displayExchangeAmount.bindEvents();

  const selectAllCurrenciesContainer = document.querySelector('#currencySelectorDiv');
  const selectAllCurrenciesView =new SelectAllCurrenciesView(selectAllCurrenciesContainer);
  selectAllCurrenciesView.bindEvents();

  const currencies = new Currencies();
  currencies.bindEvents();
})
