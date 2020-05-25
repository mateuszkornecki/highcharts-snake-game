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
  // eslint-disable-next-line no-unused-vars
  Math.hypot = function (x, y) {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=896264#c28
    let max = 0;
    let s = 0;
    for (let i = 0; i < arguments.length; i += 1) {
      // eslint-disable-next-line prefer-rest-params
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

// addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
(function (win, doc) {
  if (win.addEventListener) return;		// No need to polyfill

  function docHijack(p) { const old = doc[p]; doc[p] = function (v) { return addListen(old(v)); }; }
  function addEvent(on, fn, self) {
    return (self = this).attachEvent(`on${on}`, (e) => {
      var e = e || win.event;
      e.preventDefault = e.preventDefault || function () { e.returnValue = false; };
      e.stopPropagation = e.stopPropagation || function () { e.cancelBubble = true; };
      fn.call(self, e);
    });
  }
  function addListen(obj, i) {
    if (i = obj.length) while (i--)obj[i].addEventListener = addEvent;
    else obj.addEventListener = addEvent;
    return obj;
  }

  addListen([doc, win]);
  if ('Element' in win)win.Element.prototype.addEventListener = addEvent;			// IE8
  else {																			// IE < 8
    doc.attachEvent('onreadystatechange', () => { addListen(doc.all); });		// Make sure we also init at domReady
    docHijack('getElementsByTagName');
    docHijack('getElementById');
    docHijack('createElement');
    addListen(doc.all);
  }
}(window, document));

