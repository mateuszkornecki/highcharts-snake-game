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
        this.direction = 'DOWN';
        this.refreshRate = 100;
        this.score = 0;
    }

    addKeyDownListener() {
        document.addEventListener('keydown', event => {
            switch (event.key) {
                case 'ArrowRight':
                    this.setDirection('RIGHT');
                    break;
                case 'ArrowLeft':
                    this.setDirection('LEFT');
                    break;
                case 'ArrowUp':
                    this.setDirection('UP');
                    break;
                case 'ArrowDown':
                    this.setDirection('DOWN');
                    break;
            }
        })
    }

    renderHead() {
        this.chart.snake = this.svgGroup = this.chart.renderer.g()
            .add()
            .toFront();

        this.chart.snakeHead = this.chart.renderer.rect(this.initialX, this.initialY, this.height, this.width)
            .attr({ fill: 'tomato', 'stroke-width': 1, stroke: 'white' })
            .add(this.svgGroup);

        this.segments.push(this.chart.snakeHead);
    }

    startGame() {
        this.addKeyDownListener()
        this.renderHead();
        this.startInterval('DOWN');
    }

    resetGame() {
        this.setScore(0);
        this.svgGroup.destroy();
        this.translateX = 0;
        this.translateY = 0;
        this.direction = 'DOWN';
        this.segments.splice(0, this.segments.length);
        this.playAgainButton.destroy();
    }

    startInterval() {
        this.interval = setInterval(() => {
            this.onWallCollision();
            this.onPointCollision();
            this.move(this.direction);
        }, this.refreshRate);
    }

    stopInterval() {
        clearInterval(this.interval);
    }

    setDirection(direction) {
        this.direction = direction;
    }

    translateSegments() {
        this.segments.forEach((segment, index) => {
            if (index === this.segments.length - 1) {
                segment.translate(this.translateX, this.translateY);
            } else {
                const previousTranslate = { x: this.segments[index + 1].translateX, y: this.segments[index + 1].translateY },
                    translate = { x: previousTranslate.x - segment.translateX, y: previousTranslate.y - segment.translateY }
                segment.translate(previousTranslate.x, previousTranslate.y);
            }
        })
    }

    move(direction) {
        if (direction === 'UP' && this.isInsideAfterTranslation('UP')) {
            this.translateY -= this.size;
            this.translateSegments();
        } else if (direction === 'DOWN' && this.isInsideAfterTranslation('DOWN')) {
            this.translateY += this.size;
            this.translateSegments();
        } else if (direction === 'RIGHT' && this.isInsideAfterTranslation('RIGHT')) {
            this.translateX += this.size;
            this.translateSegments();
        } else if (direction === 'LEFT' && this.isInsideAfterTranslation('LEFT')) {
            this.translateX -= this.size;
            this.translateSegments();
        }
    }

    isInsideAfterTranslation(direction) {
        switch (direction) {
            case 'UP':
                return this.translateY - this.size >= 0;
            case 'DOWN':
                return this.translateY + this.size <= this.chart.plotHeight;
            case 'RIGHT':
                return this.translateX + this.size <= this.chart.plotWidth;
            case 'LEFT':
                return this.translateX - this.size >= 0;
        }
    }

    getActualHeadPosition() {
        return { x: this.initialX + this.translateX, y: this.initialY + this.translateY }
    }

    getDistanceBetween(pointA, pointB) {
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

    detectPointCollision() {
        const closestPoint = this.getClosestPoint(),
            closestPointPos = { x: closestPoint.plotX + this.chart.plotLeft, y: closestPoint.plotY + this.chart.plotTop },
            actualPosition = this.getActualHeadPosition(),
            distanceBetween = this.getDistanceBetween(closestPointPos, actualPosition);

        return distanceBetween < (this.size)
    }

    detectWallCollision() {
        if (!this.isInsideAfterTranslation(this.direction)) {
            return true
        }
    }

    genereteNewPoints() {
        if (this.chart.series[0].data.length === 0) {
            this.chart.series[0].setData(getRandomData(5), false);
            this.chart.series[0].update({color: getRandomColor()});
        }
    }

    gameOver() {
        this.stopInterval();
        this.chart.update({
            title: {
                useHTML: true,
                text: `GAME OVER <br> Final score: ${this.score}`
            }
        })
        this.playAgainButton = this.chart.renderer.button(
            'Play again!',
            this.chart.plotWidth / 2,
            this.chart.plotHeight / 2
        )
            .add()
            .on('click', () => {
                this.resetGame();
                this.startGame();
            })
    }

    onWallCollision() {
        if (this.detectWallCollision()) {
            this.gameOver();
        }
    }

    onPointCollision() {
        if (this.detectPointCollision()) {
            this.eat();
            this.addBodySegment();
            this.setScore(1);
            this.genereteNewPoints();
        }
    }

    eat() {
        const closestPoint = this.getClosestPoint();
        closestPoint.remove();
    }

    setScore(value) {
        if (value === 0) {
            this.score = 0;
        } else {
            this.score += value;
        }

        this.chart.update({ title: { text: `Score: ${this.score}` } })
    }

    addBodySegment() {
        const bodySegment = this.chart.renderer.rect(this.initialX, this.initialY, this.size, this.size)
            .attr({ fill: 'lightblue', 'stroke-width': 1, stroke: 'white' })
            .add(this.svgGroup)
            .translate(this.translateX, this.translateY);

        this.segments.unshift(bodySegment);
    }
};

function getRandomData(amount) {
    const randomData = [];
    for (let i = 0; i < amount; i++) {
        randomData.push(getRandomNumber(10));
    }
    return randomData;
}

function getRandomNumber(max) {
    return Math.round(Math.random() * max)
}

function getRandomColor() {
    return `rgb(${getRandomNumber(255)}, ${getRandomNumber(255)}, ${getRandomNumber(255)})`;
}

Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        events: {
            load() {
                const snake = new Snake(this);
                snake.startGame();
            },
        }
    },
    title: {
        text: 'Score: 0'
    },
    tooltip: {
        enabled: false
    },
    series: [{
        name: `Eat'em all!`,
        data: getRandomData(5)
    }]

});
