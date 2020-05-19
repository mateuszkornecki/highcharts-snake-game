# Creating a snake game with the Highcharts.js library

## Intro
Highcharts is known as a highly customizable library that is allowing users to create almost anything they can imagine. How far can we push its limits? Is it possible to create a playable game that will interact with our charts using the Highcharts.js library? Let’s find out.

In this article, you will find some tips on how to transform your charts into a simple snake game. 

## SVG Renderer
The very important tool that might help with implementing custom elements that are not included in the Highcharts core is the Highcharts SVG renderer. It can be used to add to your chart a custom SVG element that can be created in any shape - the only thing that limits you is your imagination. If you’ve used canvas API before you will feel _at home_.

### SVG Elements
There are a few basic elements that can be rendered, you could create a [circle](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#circle), [arc](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#arc), [rectangle](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#rect), [text element](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#text), [label](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#label), [button](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#button), [symbol](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#symbol) or draw a [path](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#path). This time we will focus on rendering a rectangle that will be used to create a snake body. 

## Creating a snake
Before we could start rendering we need to create a layer where we could place rendered elements. For this purpose, you could use a chart that is already created but it is worth mentioning that it is possible to create an  [independent SVG drawing](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/renderer-on-chart). 

Because I wanted to create a game that could be interactive with the chart, I'm starting from a basic scatter chart. 

``` javascript
// https://jsfiddle.net/BlackLabel/nz845cqe/
const chart = Highcharts.chart('container', {
	chart: {
		type: 'scatter'
	},
  series: [{
    data: [4, 3, 5, 6, 2, 3]
  }]
});
```

 Now we the renderer can be accessed straight from the chart that we just created. To use it and create the first rectangle we can use [renderer.rect(x, y, width, height)](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#rect) method. The method takes four arguments: 
1. x - distance (in px) from the left side of the container
2. y - distance from the top of the container
3. width of the rectangle
4. height of the rectangle

![svg renderer guide](./assets/svgRendererGuide.)

Using the renderer method returns an SVG element with the given coordinates and sizes, but before we will add it to our char we need to apply some attributes like `fill`, `stroke`, or `stroke-width` to make our rectangle visible. To do that we could use the [attr()](https://api.highcharts.com/class-reference/Highcharts.SVGElement#attr) method. After specifying those attributes we could finally add the SVG element to our chart using the [add()](https://api.highcharts.com/class-reference/Highcharts.SVGElement#add) method. 

Our snake will be a red rectangle, 20x20px size - the code that will add it to our chart should look like this:

```javascript
// https://jsfiddle.net/BlackLabel/0nycxdsz/
const snake = chart.renderer.rect(0, 0, 20, 20)
	.attr({
		fill: 'red'
	})
	.add();
```

After adding this snippet to our chart we should end up with a scatter chart with a red rectangle renderer in the top-left corner.

## Let it move!
In the previous paragraph, we learned how to render a simple rectangle, but it is just a static. Our snake should be more lively. To wake him up, we need to learn about translate() method. It will allow us to the element by a certain x and y values. So if we want to move snake by 100px to the right should use
```javascript 
// https://jsfiddle.net/BlackLabel/yqsma7e8/
snake.translate(100,0);
```

Now we could use that knowledge to tell our snake to continuously move to the right size until he won’t leave our chart (we don’t want him to run away, right?). To achieve that we could create a simple interval which each time will move the snake by an increased value. To limit our snake we could use one take from the chart properties the size of the plot. It can be found under `chart.plotWidth` property. Additionally, we could use another chart properties - `chart.plotLeft` and `chart.plotTop` to update the snake’s initial position (right now it is rendered outside of a plot area, we want him to be inside it).

```javascript
// https://jsfiddle.net/BlackLabel/npvL5rf3/
const snake = chart.renderer.rect(
	chart.plotLeft, 
	chart.plotTop, 
	20, 
	20
)
  .attr({
    fill: 'red'
  })
  .add();

let x = 0;

setInterval(() => {
  if (x + 20 < chart.plotWidth) {
		x += 20;
		snake.translate(x, 0);
  }
}, 250);
```

## Feed the snake!
So far we have learned how to create a snake, give him the ability to move but he still lacks a very important skill - eating points. To do that we need to somehow remove a point when it has the same position as our snake. To make it easier I will set the same value for all points and the [min](https://api.highcharts.com/highcharts/xAxis.min) and [max](https://api.highcharts.com/highcharts/xAxis.max) properties values for both axes.

```javascript
// https://jsfiddle.net/BlackLabel/tmoxv7e1/
const chart = Highcharts.chart('container', {
  chart: {
    type: 'scatter'
  },
  xAxis: {
    min: 0,
    max: 8
  },
  yAxis: {
    min: 0,
    max: 8
  },
  series: [{
    pointStart: 1,
    data: [8, 8, 8, 8, 8, 8, 8, 8]
  }]
});
```

Now we are ready to implement this feature. All we have to do is to compare the pixel position of the snake with the points. 

To get the actual snake position we need to add a translate value to its initial position. Translate value can be found under snake.translateX property, to get the initial position we could use the [attr()](https://api.highcharts.com/class-reference/Highcharts.SVGElement#attr) method that will return a value of the certain attribute. 

```javascript
const snakePosX = snake.attr('x') + snake.translateX;
```

There are several ways to find a pixel coordinates of a point, but the easiest one is to use axis [toPixels()](https://api.highcharts.com/class-reference/Highcharts.Axis#toPixels) method that will return a pixel position of the value on the chart or axis. 

```javascript
const pointPosX = xAxis.toPixels(point.x)
```

Now, all we have to do is create a simple function that will iterate over all points and remove a point whose distance is smaller than a snake size. To remove a point we could use the [remove()](https://api.highcharts.com/class-reference/Highcharts.Point#remove) method. Then we could call that function inside the interval that is responsible for moving the snake. Our snake finally learned how to eat chart points.

```javascript
// https://jsfiddle.net/BlackLabel/Lk4wfs1y/
function onCollision() {
	const xAxis = chart.xAxis[0],
    points = chart.series[0].points,
    snakePosX = snake.attr('x') + snake.translateX;

  points.forEach(point => {
    const pointPosX = xAxis.toPixels(point.x)
		
    if (Math.abs(snakePosX - pointPosX) < 20) {
      point.remove();
    }
  })
}
```

Our snake has learned some basic abilities. Of course to create a fully functional game we still have a lot to improve but the most important parts related to the snake’s integration with the Highcharts library are described in this article.  The code for the final version of the game can be found here: https://github.com/mateuszkornecki/highcharts-snake-game/tree/master/js
