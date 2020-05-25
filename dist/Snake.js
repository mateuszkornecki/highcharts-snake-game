/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
import { getRandomColor, getRandomData } from './utils.js';
var Snake = /** @class */ (function () {
    function Snake(chart) {
        this.initialX = chart.plotLeft;
        this.initialY = chart.plotTop;
        this.translateX = 0;
        this.translateY = 0;
        this.size = 20;
        this.chart = chart;
        this.interval = null;
        this.svgGroup = null;
        this.segments = [];
        this.direction = 'DOWN';
        this.refreshRate = 100;
        this.score = 0;
    }
    Snake.prototype.addKeyDownListener = function () {
        var _this = this;
        document.addEventListener('keydown', function (event) {
            switch (event.key) {
                case 'ArrowRight':
                    if (_this.direction !== 'LEFT') {
                        _this.setDirection('RIGHT');
                    }
                    break;
                case 'ArrowLeft':
                    if (_this.direction !== 'RIGHT') {
                        _this.setDirection('LEFT');
                    }
                    break;
                case 'ArrowUp':
                    if (_this.direction !== 'DOWN') {
                        _this.setDirection('UP');
                    }
                    break;
                case 'ArrowDown':
                    if (_this.direction !== 'UP') {
                        _this.setDirection('DOWN');
                    }
                    break;
            }
        });
    };
    Snake.prototype.addControllers = function (eventType, condition, cases) {
        var _this = this;
        document.addEventListener(eventType, function (event) {
            switch (event[condition]) {
                case cases[0]:
                    if (_this.direction !== 'LEFT') {
                        _this.setDirection('RIGHT');
                    }
                    break;
                case cases[1]:
                    if (_this.direction !== 'RIGHT') {
                        _this.setDirection('LEFT');
                    }
                    break;
                case cases[2]:
                    if (_this.direction !== 'DOWN') {
                        _this.setDirection('UP');
                    }
                    break;
                case cases[3]:
                    if (_this.direction !== 'UP') {
                        _this.setDirection('DOWN');
                    }
                    break;
            }
        });
    };
    Snake.prototype.renderHead = function () {
        this.svgGroup = this.chart.renderer.g().add().toFront();
        this.chart.snakeHead = this.chart.renderer
            .rect(this.initialX, this.initialY, this.size, this.size)
            .attr({ fill: 'rgb(51,85,139)', 'stroke-width': 1, stroke: 'white' })
            .add(this.svgGroup);
        this.segments.push(this.chart.snakeHead);
    };
    Snake.prototype.startGame = function () {
        this.showMobileControllers();
        this.addKeyDownListener();
        this.renderHead();
        this.startInterval();
    };
    Snake.prototype.resetGame = function () {
        this.setScore(0);
        this.svgGroup.destroy();
        this.translateX = 0;
        this.translateY = 0;
        this.direction = 'DOWN';
        this.segments.splice(0, this.segments.length);
        this.generateNewPoints();
        this.playAgainButton.destroy();
    };
    Snake.prototype.startInterval = function () {
        var _this = this;
        this.interval = setInterval(function () {
            _this.onWallCollision();
            _this.onPointCollision();
            _this.onBodyCollision();
            _this.move(_this.direction);
        }, this.refreshRate);
    };
    Snake.prototype.stopInterval = function () {
        clearInterval(this.interval);
    };
    Snake.prototype.setDirection = function (direction) {
        this.direction = direction;
    };
    Snake.prototype.translateSegments = function () {
        var _this = this;
        this.segments.forEach(function (segment, index) {
            if (index === _this.segments.length - 1) {
                segment.translate(_this.translateX, _this.translateY);
            }
            else {
                var previousTranslate = {
                    x: _this.segments[index + 1].translateX,
                    y: _this.segments[index + 1].translateY
                };
                segment.translate(previousTranslate.x, previousTranslate.y);
                if (segment.isNewAdded) {
                    segment.isNewAdded = false;
                }
            }
        });
    };
    Snake.prototype.move = function (direction) {
        if (direction === 'UP' && this.isInsideAfterTranslation('UP')) {
            this.translateY -= this.size;
            this.translateSegments();
        }
        else if (direction === 'DOWN' && this.isInsideAfterTranslation('DOWN')) {
            this.translateY += this.size;
            this.translateSegments();
        }
        else if (direction === 'RIGHT' && this.isInsideAfterTranslation('RIGHT')) {
            this.translateX += this.size;
            this.translateSegments();
        }
        else if (direction === 'LEFT' && this.isInsideAfterTranslation('LEFT')) {
            this.translateX -= this.size;
            this.translateSegments();
        }
    };
    Snake.prototype.isInsideAfterTranslation = function (direction) {
        switch (direction) {
            case 'UP':
                return this.translateY - this.size >= 0;
            case 'DOWN':
                return this.translateY + this.size <= this.chart.plotHeight;
            case 'RIGHT':
                return this.translateX + 2 * this.size <= this.chart.plotWidth;
            case 'LEFT':
                return this.translateX - this.size >= 0;
        }
    };
    Snake.prototype.getActualHeadPosition = function () {
        return {
            x: this.initialX + this.translateX,
            y: this.initialY + this.translateY
        };
    };
    Snake.prototype.getDistanceBetween = function (pointA, pointB) {
        return Math.hypot(Math.abs(pointA.x - pointB.x), Math.abs(pointA.y - pointB.y));
    };
    Snake.prototype.getCollidedPoint = function () {
        var _this = this;
        var points = this.chart.series[0].points;
        var actualHeadPosition = this.getActualHeadPosition();
        var collidedPoint = null;
        points.forEach(function (point) {
            var pointPosition = {
                x: point.plotX + _this.chart.plotLeft,
                y: point.plotY + _this.chart.plotTop
            };
            var distanceBetween = _this.getDistanceBetween(actualHeadPosition, pointPosition);
            if (distanceBetween < _this.size) {
                collidedPoint = point;
            }
        });
        return collidedPoint;
    };
    Snake.prototype.detectWallCollision = function () {
        return !this.isInsideAfterTranslation(this.direction);
    };
    Snake.prototype.detectBodyCollision = function () {
        var _this = this;
        var actualHeadPosition = this.getActualHeadPosition();
        var isBodyCollision = false;
        this.segments.forEach(function (segment, index) {
            if (index < _this.segments.length - 1) {
                var segmentPosition = {
                    x: _this.initialX + segment.translateX,
                    y: _this.initialY + segment.translateY
                };
                var isCollision = actualHeadPosition.x - segmentPosition.x === 0
                    && actualHeadPosition.y - segmentPosition.y === 0
                    && !segment.isNewAdded;
                if (isCollision) {
                    isBodyCollision = true;
                }
            }
        });
        return isBodyCollision;
    };
    Snake.prototype.generateNewPoints = function () {
        this.chart.series[0].setData(getRandomData(5), false);
        this.chart.series[0].update({ color: getRandomColor() });
    };
    Snake.prototype.gameOver = function () {
        var _this = this;
        this.stopInterval();
        this.chart.update({
            title: {
                useHTML: true,
                text: "GAME OVER <br> Final score: " + this.score
            }
        });
        this.playAgainButton = this.chart.renderer
            .button('Play again!', this.chart.plotWidth / 2, this.chart.plotHeight / 2 + this.chart.plotTop)
            .add()
            .on('click', function () {
            _this.resetGame();
            _this.startGame();
        });
        var playAgainButtonBBox = this.playAgainButton.getBBox();
        this.playAgainButton.translate(this.chart.plotWidth / 2 - playAgainButtonBBox.width / 2, this.chart.plotHeight / 2 + this.chart.plotTop - playAgainButtonBBox.height / 2);
    };
    Snake.prototype.onWallCollision = function () {
        if (this.detectWallCollision()) {
            this.gameOver();
        }
    };
    Snake.prototype.onPointCollision = function () {
        var collidedPoint = this.getCollidedPoint();
        if (collidedPoint) {
            this.eat(collidedPoint);
            this.addBodySegment();
            this.setScore(1);
            if (this.chart.series[0].data.length === 0) {
                this.generateNewPoints();
            }
        }
    };
    Snake.prototype.onBodyCollision = function () {
        if (this.detectBodyCollision()) {
            this.gameOver();
        }
    };
    Snake.prototype.eat = function (point) {
        point.remove();
    };
    Snake.prototype.setScore = function (value) {
        if (value === 0) {
            this.score = 0;
        }
        else {
            this.score += value;
        }
        this.chart.update({
            title: {
                text: "Score: " + this.score
            }
        });
    };
    Snake.prototype.getSegmentTransparency = function () {
        return this.segments.length > 25 ? 0.1 : 1.1 - this.segments.length / 25;
    };
    Snake.prototype.addBodySegment = function () {
        var bodySegment = this.chart.renderer
            .rect(this.initialX, this.initialY, this.size, this.size)
            .attr({
            fill: "rgba(51,85,139," + this.getSegmentTransparency(),
            'stroke-width': 1,
            stroke: 'white'
        })
            .add(this.svgGroup)
            .translate(this.translateX, this.translateY);
        bodySegment.isNewAdded = true;
        this.segments.unshift(bodySegment);
    };
    Snake.prototype.isMobile = function () {
        return Boolean('ontouchstart' in window);
    };
    Snake.prototype.showMobileControllers = function () {
        if (this.isMobile()) {
            var mobileControllers = document.getElementById('mobile-controllers');
            mobileControllers.classList.remove('mobile-controllers--hidden');
            this.addMobileControllersListeners();
        }
    };
    Snake.prototype.addMobileControllersListeners = function () {
        var _this = this;
        var mobileControllers = document.getElementById('mobile-controllers');
        mobileControllers.addEventListener('click', function (event) {
            switch (event.target.id) {
                case 'mobile-controllers__right':
                    if (_this.direction !== 'LEFT') {
                        _this.setDirection('RIGHT');
                    }
                    break;
                case 'mobile-controllers__left':
                    if (_this.direction !== 'RIGHT') {
                        _this.setDirection('LEFT');
                    }
                    break;
                case 'mobile-controllers__up':
                    if (_this.direction !== 'DOWN') {
                        _this.setDirection('UP');
                    }
                    break;
                case 'mobile-controllers__down':
                    if (_this.direction !== 'UP') {
                        _this.setDirection('DOWN');
                    }
                    break;
            }
        });
    };
    return Snake;
}());
export default Snake;
