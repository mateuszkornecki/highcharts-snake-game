import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';

class Snake{
    constructor(initialX, initialY, chart) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.posX = 0;
        this.posY = 0;
        this.size = this.height = this.width = 10;
        this.chart = chart;
      }

      render() {
        this.chart.snake = this.chart.renderer.rect(this.initialX, this.initialY, this.height, this.width)
            .attr({fill: 'red'})
            .add()
            .toFront();
      }

      moveRight(direction) {
        const isInsidePlotArea = this.posX + this.size <= this.chart.plotWidth;
        if(isInsidePlotArea) {
          this.posX += this.size;
          this.chart.snake.translate(this.posX,this.posY);
        }
      }

      moveLeft(direction) {
        const isInsidePlotArea = this.posX - this.size >= 0;
        if(isInsidePlotArea) {
          this.posX -= this.size;
        this.chart.snake.translate(this.posX,this.posY);
        }
      }

      moveUp(direction) {
        const isInsidePlotArea = this.posY - this.width >= 0
        if(isInsidePlotArea){
          this.posY -= this.size;
        this.chart.snake.translate(this.posX,this.posY);
        }
      }

      moveDown(direction) {
        if(this.posY + this.size <= this.chart.plotHeight) {
        this.posY += 10;
        this.chart.snake.translate(this.posX,this.posY);
      }
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
  