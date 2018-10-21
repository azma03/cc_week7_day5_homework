const PubSub = require('../helpers/pub_sub.js');

const DisplayExchangeRate =function(container){
  this.container = container;
}

DisplayExchangeRate.prototype.bindEvents = function () {
  PubSub.subscribe('Currencies:exchange-amount-calculated', (event) => {
    console.log('event from displayExchangeAmount', event);
    this.render(event.detail);
  })
};

DisplayExchangeRate.prototype.createElementandSetValue = function (element, value) {
  const infoElement = document.createElement(element);
  infoElement.textContent = value;
  return infoElement;
};

DisplayExchangeRate.prototype.render = function (exchange) {
  // debugger;
  this.container.innerHTML = '';

  const srcDiv = document.createElement('div');
  // srcDiv.classList.add('noSpaceDiv');
  const destDiv = document.createElement('div');
  // destDiv.classList.add('noSpaceDiv');

  const exchangeOriginal = this.createElementandSetValue('p', exchange.originalAmount);
  const exchangeSource = this.createElementandSetValue('p', exchange.sourceCurrency);
  const exchangeEqualSign = this.createElementandSetValue('p', '=');
  // exchangeSource.classList.add('equalsAfter');

  const exchangeAmount = this.createElementandSetValue('h4', exchange.exchangeAmount);
  const exchangeDestination = this.createElementandSetValue('p', exchange.destinationCurrency);

  srcDiv.appendChild(exchangeOriginal);
  srcDiv.appendChild(exchangeSource);

  destDiv.appendChild(exchangeAmount);
  destDiv.appendChild(exchangeDestination);

  this.container.appendChild(srcDiv);
  this.container.appendChild(exchangeEqualSign);
  this.container.appendChild(destDiv);

  if(document.querySelector('.exchangeDateFormat')){
    const dateElement = document.querySelector('.exchangeDateFormat');
    // debugger;
    dateElement.parentNode.removeChild(dateElement);
  }

  const exchangeRateDate = this.createElementandSetValue('p', `With exchange rate of ${new Date(exchange.exchangeRateDate)}`);
  exchangeRateDate.classList.add('exchangeDateFormat');

  // document.removeChild(exchangeRateDate.parentNode)
  const exchangeDateDiv = document.querySelector('#exchangeDate');
  exchangeDateDiv.appendChild(exchangeRateDate);

  // this.container.appendChild(exchangeOriginal);
  // this.container.appendChild(exchangeSource);
  // this.container.appendChild(exchangeAmount);
  // this.container.appendChild(exchangeDestination);

  PubSub.publish("DisplayExchangeRate:amount-displayed", exchange);
};

module.exports = DisplayExchangeRate;
