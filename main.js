import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';

class Snake {
    constructor(chart) {
        this.initialX = chart.plotLeft;
        this.initialY = chart.plotTop;
        this.translateX = 0;
        this.translateY = 0;
        this.size = this.height = this.width = 20;
        this.chart = chart;
        this.interval = null;
        this.svgGroup = null;
        this.segments = [];
    }

    renderHead() {
        this.chart.snake = this.svgGroup = this.chart.renderer.g()
            .add()
            .toFront();

        this.chart.snakeHead = this.chart.renderer.rect(this.initialX, this.initialY, this.height, this.width)
            .attr({ fill: 'tomato','stroke-width': 1, stroke: 'white'})
            .add(this.svgGroup);
        
        this.segments.push(this.chart.snakeHead);
    }

    startGame() {
        this.renderHead();
        this.autoPilot('DOWN');
    }

    autoPilot(direction) {
        this.interval = setInterval(() => {
            // TODO: Need to find a better place for eat() init.
            this.eat();
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

    translateSegments() {
        this.segments.forEach((segment, index) => {
            if(index === this.segments.length - 1){
                segment.translate(this.translateX, this.translateY);
            } else {
                const previousTranslate = {x: this.segments[index + 1].translateX,  y: this.segments[index +  1].translateY}
                const translate = {x: previousTranslate.x - segment.translateX, y: previousTranslate.y - segment.translateY }
                console.log(segment.translateX, segment.translateY , previousTranslate);
                segment.translate(previousTranslate.x, previousTranslate.y );
            }
        })
    }

    moveRight() {
        const isInsidePlotArea = this.translateX + this.size <= this.chart.plotWidth;
        if (isInsidePlotArea) {
            this.translateX += this.size;
            this.translateSegments();

        }
    }

    moveLeft() {
        const isInsidePlotArea = this.translateX - this.size >= 0;
        if (isInsidePlotArea) {
            this.translateX -= this.size;
            this.translateSegments();
        }
    }

    moveUp() {
        const isInsidePlotArea = this.translateY - this.size >= 0;
        if (isInsidePlotArea) {
            this.translateY -= this.size;
            this.translateSegments();
        }
    }

    moveDown() {
        const isInsidePlotArea = this.translateY + this.size <= this.chart.plotHeight
        if (isInsidePlotArea) {
            this.translateY += this.size;
            this.translateSegments();
        }
    }

    getActualHeadPosition() {
        return { x: this.initialX + this.translateX, y: this.initialY + this.translateY }
    }

    getDistanceBetween (pointA, pointB) {
        return Math.hypot(Math.abs(pointA.x - pointB.x), Math.abs(pointA.y - pointB.y));
    }

    getClosestPoint() {
        const points = this.chart.series[0].points,
            actualPosition = this.getActualHeadPosition();
        let closestPoint = null;
        points.reduce((previousDistance, point) => {
            const pointPosition = { x: point.plotX + this.chart.plotLeft, y: point.plotY + this.chart.plotTop },
                distanceBetween = this.getDistanceBetween(actualPosition, pointPosition);
            if (distanceBetween < previousDistance) {
                closestPoint = point;
            };
            return this.getDistanceBetween(actualPosition, pointPosition)
        }, 1000000);

        return closestPoint;
    }

    detectCollision() {
        const closestPoint = this.getClosestPoint(),
            closestPointPos = {x: closestPoint.plotX + this.chart.plotLeft, y:closestPoint.plotY + this.chart.plotTop},
            actualPosition = this.getActualHeadPosition(),
            distanceBetween = this.getDistanceBetween(closestPointPos, actualPosition);

        return distanceBetween < (this.size)
    }

    eat() {
        const isCollision = this.detectCollision(),
            closestPoint = this.getClosestPoint();

        if(isCollision) {
            closestPoint.destroy();
            this.addBodySegment();
        }
    }

    addBodySegment() {
        const bodySegment = this.chart.renderer.rect(this.initialX, this.initialY, this.size, this.size)
        .attr({ fill: 'lightblue','stroke-width': 1, stroke: 'white'})
        .add(this.svgGroup)
        .translate(this.translateX,this.translateY);
    
        this.segments.unshift(bodySegment);
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
                const snake = new Snake(chart);
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
                        case ' ':
                            // for debugging purpose only.
                            snake.autoPilotStop();
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
