import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';

class Snake{
    constructor(initialX, initialY, chart) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.posX = 0;
        this.posY = 0;
        this.height = 10;
        this.width = 10;
        this.chart = chart;
      }

      render() {
        this.chart.snake = this.chart.renderer.rect(this.initialX, this.initialY, this.height, this.width)
            .attr({fill: 'red'})
            .add()
            .toFront();
      }

      moveRight(direction) {
        this.posX += 10;
        this.chart.snake.translate(this.posX,this.posY);
      }

      moveLeft(direction) {
        this.posX -= 10;
        this.chart.snake.translate(this.posX,this.posY);
      }

      moveUp(direction) {
        this.posY -= 10;
        this.chart.snake.translate(this.posX,this.posY);
      }

      moveDown(direction) {
        this.posY += 10;
        this.chart.snake.translate(this.posX,this.posY);
      }
      
};

Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        events: {
            load(){
                const chart = this,
                    x = chart.plotLeft,
                    y = chart.plotTop;
                    console.log(x,y);
                const snake = new Snake(x,y, chart);
                snake.render();
                document.addEventListener('keydown', event => {
                    switch(event.key) {
                        case 'ArrowRight': 
                        snake.moveRight();
                        break;
                        case 'ArrowLeft': 
                        snake.moveLeft();
                        break;
                        case 'ArrowUp': 
                        snake.moveUp();
                        break;
                        case 'ArrowDown': 
                        snake.moveDown();
                        break;

                    }
                })

            }

        }
    },
    series: [{
      data: [4, 3, 5, 6, 2, 3]
    }]
  
  });
  