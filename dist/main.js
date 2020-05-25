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
            load: function () {
                var snake = new Snake(this);
                snake.startGame();
            }
        }
    },
    title: {
        text: 'Score: 0'
    },
    xAxis: {
        min: 0,
        max: 11,
        tickWidth: 0,
        visible: false
    },
    yAxis: {
        min: 0,
        max: 11,
        gridLineWidth: 0,
        visible: false
    },
    legend: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    series: [
        {
            name: "Eat'em all!",
            data: getRandomData(5)
        },
    ]
});
