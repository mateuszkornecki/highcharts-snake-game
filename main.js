import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';

class Snake {
    constructor(initialX, initialY, chart) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.translateX = 0;
        this.translateY = 0;
        this.size = this.height = this.width = 10;
        this.chart = chart;
        this.interval = null;
    }

    render() {
        this.chart.snake = this.chart.renderer.rect(this.initialX, this.initialY, this.height, this.width)
            .attr({ fill: 'red' })
            .add()
            .toFront();
    }

    startGame() {
        this.render();
        this.autoPilot('DOWN');
    }

    autoPilot(direction) {
        this.interval = setInterval(() => {
            if (direction === 'UP') {
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
        const isInsidePlotArea = this.translateX + this.size <= this.chart.plotWidth;
        if (isInsidePlotArea) {
            this.translateX += this.size;
            this.chart.snake.translate(this.translateX, this.translateY);
        }
    }

    moveLeft() {
        const isInsidePlotArea = this.translateX - this.size >= 0;
        if (isInsidePlotArea) {
            this.translateX -= this.size;
            this.chart.snake.translate(this.translateX, this.translateY);
        }
    }

    moveUp() {
        const isInsidePlotArea = this.translateY - this.width >= 0
        if (isInsidePlotArea) {
            this.translateY -= this.size;
            this.chart.snake.translate(this.translateX, this.translateY);
        }
    }

    moveDown() {
        const isInsidePlotArea = this.translateY + this.size <= this.chart.plotHeight
        if (isInsidePlotArea) {
            this.translateY += 10;
            this.chart.snake.translate(this.translateX, this.translateY);
        }
    }

    getActualPosition() {
        return { x: this.initialX + this.translateX, y: this.initialY + this.translateY }
    }

    getClosestPoint() {
        const points = this.chart.series[0].points,
            actualPosition = this.getActualPosition(),
            getDistanceBetween = (pointA, pointB) => {
                return Math.hypot(Math.abs(pointA.x - pointB.x), Math.abs(pointA.y, pointB.y));
            }
      

        let closestPoint = null;
        points.reduce((previousDistance, point) => {
            const pointPosition = { x: point.plotX + this.chart.plotLeft, y: point.plotY + this.chart.plotTop },
                distanceBetween = getDistanceBetween(actualPosition, pointPosition);
            if (distanceBetween < previousDistance) {
                closestPoint = point;
            };
            return getDistanceBetween(actualPosition, pointPosition)
        }, 1000000);

        return closestPoint;
    }

};

Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        events: {
            load() {
                const chart = this,
                    x = chart.plotLeft,
                    y = chart.plotTop;
                const snake = new Snake(x, y, chart);
                snake.startGame();
                document.addEventListener('keydown', event => {
                    switch (event.key) {
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
