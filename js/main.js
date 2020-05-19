/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import Snake from './Snake.js';
import { getRandomData } from './utils.js';

Highcharts.chart('game-container', {
  chart: {
    type: 'scatter',
    plotBorderWidth: 1,
    events: {
      load() {
        const snake = new Snake(this);
        snake.startGame();
      },
    },
  },
  title: {
    text: 'Score: 0',
  },
  xAxis: {
    min: 0,
    max: 11,
    tickWidth: 0,
  },
  yAxis: {
    min: 0,
    max: 11,
    gridLineWidth: 0,
  },
  tooltip: {
    enabled: false,
  },
  series: [
    {
      name: "Eat'em all!",
      data: getRandomData(5),
      events: {
        legendItemClick() {
          return false;
        },
      },
    },
  ],
});
