/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import Highcharts from 'highcharts';
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
    visible: false,
  },
  yAxis: {
    min: 0,
    max: 11,
    gridLineWidth: 0,
    visible: false,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  series: [
    {
      name: "Eat'em all!",
      data: getRandomData(5),
    },
  ],
});

/* eslint-disable */
if (!Math.hypot) {
  Math.hypot = function (x, y) {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=896264#c28
    let max = 0;
    let s = 0;
    for (let i = 0; i < arguments.length; i += 1) {
      const arg = Math.abs(Number(arguments[i]));
      if (arg > max) {
        s *= (max / arg) * (max / arg);
        max = arg;
      }
      s += arg === 0 && max === 0 ? 0 : (arg / max) * (arg / max);
    }
    return max === 1 / 0 ? 1 / 0 : max * Math.sqrt(s);
  };
}
