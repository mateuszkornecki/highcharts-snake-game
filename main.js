import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';

class Snake{
    constructor(initialX, initialY, chart) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.posX = 0;
        this.posY = 0;
        this.size = this.height = this.width = 10;
        this.chart = chart;
        this.interval = null;
      }

      render() {
        this.chart.snake = this.chart.renderer.rect(this.initialX, this.initialY, this.height, this.width)
            .attr({fill: 'red'})
            .add()
            .toFront();
      }

      startGame() {
        this.render();
        this.autoPilot('DOWN');
      }

      autoPilot(direction){
        this.interval = setInterval(() => {
          if(direction === 'UP') {
            this.moveUp();
          } else if (direction === 'DOWN') {
            this.moveDown();
          } else if (direction === 'RIGHT') {
            this.moveRight();
          } else if (direction === 'LEFT') {
            this.moveLeft();
          }
      }, 500);
      }

      autoPilotStop() {
        clearInterval(this.interval);
      }

      turn(direction) {
        this.autoPilotStop();
        this.autoPilot(direction);
      }

      moveRight() {
        const isInsidePlotArea = this.posX + this.size <= this.chart.plotWidth;
        if(isInsidePlotArea) {
          this.posX += this.size;
          this.chart.snake.translate(this.posX,this.posY);
        }
      }

      moveLeft() {
        const isInsidePlotArea = this.posX - this.size >= 0;
        if(isInsidePlotArea) {
          this.posX -= this.size;
        this.chart.snake.translate(this.posX,this.posY);
        }
      }

      moveUp() {
        const isInsidePlotArea = this.posY - this.width >= 0
        if(isInsidePlotArea){
          this.posY -= this.size;
        this.chart.snake.translate(this.posX,this.posY);
        }
      }

      moveDown() {
        const isInsidePlotArea = this.posY + this.size <= this.chart.plotHeight
        if(isInsidePlotArea) {
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
                const snake = new Snake(x, y ,chart);
                snake.startGame();
                document.addEventListener('keydown', event => {
                    switch(event.key) {
                        case 'ArrowRight': 
                        snake.turn('RIGHT');
                        break;
                        case 'ArrowLeft': 
                        snake.turn('LEFT');
                        break;
                        case 'ArrowUp': 
                        snake.turn('UP');
                        break;
                        case 'ArrowDown': 
                        snake.turn('DOWN');
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
  