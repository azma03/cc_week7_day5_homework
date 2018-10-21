// API -- https://exchangeratesapi.io/
const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');
const Moment = require('moment');

const Currencies = function(){
  this.currencies = null;
}

Currencies.prototype.bindEvents = function () {
  const url = 'https://api.exchangeratesapi.io/latest?base=USD';
  const request = new Request(url);

  request.get().then(data => {
    console.log(data);
    this.currencies = data;
    const allCurrencies = this.getAllCurrencies(data);
    // debugger;
    PubSub.subscribe('SelectAllCurrenciesView:form-submitted', (event) => {
      console.log("form submitted event subscribed", event);
      const amount = event.detail.amount.value;
      const sourceCurrency = allCurrencies[event.detail.sourceCurrency.value];
      const destinationCurrency = allCurrencies[event.detail.destinationCurrency.value];
      // debugger;
      this.convertAmountToDestinationCurrency(amount, sourceCurrency, destinationCurrency, this.currencies.date);
    })
    PubSub.subscribe('DisplayExchangeRate:amount-displayed', (event) => {

      this.getHistoricExchangeRate(event);
    })
  });
};

Currencies.prototype.getAllCurrencies = function (data) {
  // this.currencies = Object.keys(data.rates);
  // this.currencies.push(data.base);
  let currenciesList = Object.keys(data.rates);
  // currenciesList.push(data.base);
  // debugger;
  currenciesList = currenciesList.sort();
  // debugger;
  console.log(this.currencies);
  PubSub.publish('Currencies:currencies-data-ready', currenciesList);
  return currenciesList;
};


// Base conversion rule, when converting:
// From the base, multiply.
// To the base, divide.

// For example, 1 GBP to USD
// GBP - EUR (1/0.87843)
// EUR - USD (1/0.87843) * 1.1505
//
// GBP - EUR - USD   => (1/GBP rate) * USD rate * amount
Currencies.prototype.convertAmountToDestinationCurrency = function (amount, source, destination, rateDate) {
  let convertedAmount;
  convertedAmount = (1.0 / this.currencies.rates[source]) * this.currencies.rates[destination] * amount;
  console.log('sent', convertedAmount);
  convertedAmount=  +(Math.round(convertedAmount + "e+6")  + "e-6");

  const exchangeObject = {
    originalAmount: amount,
    sourceCurrency: source,
    destinationCurrency: destination,
    exchangeAmount: convertedAmount,
    exchangeRateDate: rateDate
  }
  // debugger;
  PubSub.publish('Currencies:exchange-amount-calculated', exchangeObject);

};

Currencies.prototype.getExchangeRatesArray = function (ratesData, exchangeObject) {
  console.log('ratesData', ratesData);
  // debugger;
  let exchangeRateArray =[];
  // let arrayHeader = ['Date', 'SourceCurrency', 'DestinationCurrency'];
  let arrayHeader = ['Date', Object.keys(ratesData[Object.keys(ratesData)[0]])[0], Object.keys(ratesData[Object.keys(ratesData)[0]])[1]];
  exchangeRateArray.push(arrayHeader);

  for(let i = 0; i < Object.keys(ratesData).length; i++){
    let exchangeRateForOneDayArray = [];
    for(let j = 0; j < 1; j++){
      // debugger;
      const dateKey = Object.keys(ratesData)[i];
      const currencyKey = Object.keys(ratesData[dateKey]);
      // debugger;
      exchangeRateForOneDayArray.push(new Date(dateKey));
      exchangeRateForOneDayArray.push(ratesData[dateKey][currencyKey[j]]);
      // debugger;
      if(currencyKey.length === 1){ //if to and from currencies are same
        exchangeRateForOneDayArray.push(ratesData[dateKey][currencyKey[j]]);
      }else {
        exchangeRateForOneDayArray.push(ratesData[dateKey][currencyKey[j + 1]]);
      }

      // debugger;
    }
    exchangeRateArray.push(exchangeRateForOneDayArray);
  }
  // debugger;
  console.log('exchangeRateArray', exchangeRateArray); //output should be like array below
  // [['Month', 'SourceCurrency', 'DestinationCurrency'],
  //   [new Date('2018-10-01'),  1.1606,    0.89078],
  //   [new Date('2018-10-10'),  1.153,     0.89078],
  //   [new Date('2018-10-20'),  1.2309,    0.87608],
  //   [new Date('2018-10-30'),  1.2309,    0.87608]]

  // sort the array by date
  exchangeRateArray = exchangeRateArray.sort(function(a,b) {
    return a[0] - b[0];
  });
  return exchangeRateArray;
};

Currencies.prototype.getHistoricExchangeRate = function (exchangeObject) {
  console.log('test', event);

  // const today = new Date();

  // console.log('today', today);
  // const startDate = `${today.getFullYear()}-01-01`;
  // const endDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  //using npm moment() module
  const today = Moment();
  const tempToday = Moment();
  const aYearAgo = tempToday.subtract(1, 'year');
  const startDate = `${aYearAgo.year()}-${aYearAgo.month()+1}-${aYearAgo.date()}`;
  const endDate = `${today.year()}-${today.month() + 1}-${today.date()}`;
  // debugger;

  const url = `https://api.exchangeratesapi.io/history?base=USD&start_at=${startDate}&end_at=${endDate}&symbols=${event.detail.sourceCurrency},${event.detail.destinationCurrency}`;
  // https://api.exchangeratesapi.io/history?start_at=2018-10-01&end_at=2018-10-19&symbols=GBP,USD
  const request = new Request(url);

  request.get().then(data => {
    console.log('data from getSpecificPeriodExchangeRate', data);
    // debugger;
    const exchangeRateArray = this.getExchangeRatesArray(data.rates, event);
    // return exchangeRateArray;
    // debugger;

    PubSub.publish('Currencies:data-ready-for-areaChart', exchangeRateArray);
  });
};

module.exports = Currencies;
