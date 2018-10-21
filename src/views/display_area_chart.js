const PubSub = require('../helpers/pub_sub.js');
// const Loader = require('https://www.gstatic.com/charts/loader.js');
// import {GoogleCharts} from 'google-charts';
const GoogleChartsModule = require('google-charts');

const DisplayAreaChart = function(container){
    this.container = container;
};

DisplayAreaChart.prototype.bindEvents = function () {
  const paragraph = document.createElement('p');
  paragraph.textContent = "Test Area";
  this.container.appendChild(paragraph);
  // debugger;
  // reference - https://www.npmjs.com/package/google-charts
  PubSub.subscribe("Currencies:data-ready-for-areaChart", (event) => {
    console.log('hello');
    // debugger;
    // GoogleChartsModule.GoogleCharts.load(drawChart); //requires a call back. arrow function? then it doesnt recognise this.container
    GoogleChartsModule.GoogleCharts.load(() => {
      const data = GoogleChartsModule.GoogleCharts.api.visualization.arrayToDataTable(event.detail);
          // [['Date', 'SourceCurrency', 'DestinationCurrency'],
          //   [new Date('2018-10-01'),  1.1606,    0.89078],
          //   [new Date('2018-10-10'),  1.153,     0.89078],
          //   [new Date('2018-10-20'),  1.2309,    0.87608],
          //   [new Date('2018-10-30'),  1.2309,    0.87608]]
      // );

      var options = {
            title: 'Exchange Rates',
            hAxis: {
              title: 'Time',
              format: 'MMM yyyy'
            },
            vAxis: {
              minValue: 0,
              title: 'Currency Value againt USD'
            }
          };

      const areaChart = new GoogleChartsModule.GoogleCharts.api.visualization.AreaChart(document.querySelector('#areaChart'));
      areaChart.draw(data, options);
    });
  });

};

 module.exports = DisplayAreaChart;
