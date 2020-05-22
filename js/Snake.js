/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable default-case */

import { getRandomColor, getRandomData } from './utils.js';

class Snake {
  constructor(chart) {
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

  addKeyDownListener() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowRight':
          if (this.direction !== 'LEFT') {
            this.setDirection('RIGHT');
          }
          break;
        case 'ArrowLeft':
          if (this.direction !== 'RIGHT') {
            this.setDirection('LEFT');
          }
          break;
        case 'ArrowUp':
          if (this.direction !== 'DOWN') {
            this.setDirection('UP');
          }
          break;
        case 'ArrowDown':
          if (this.direction !== 'UP') {
            this.setDirection('DOWN');
          }
          break;
      }
    });
  }

  renderHead() {
    this.svgGroup = this.chart.renderer.g().add().toFront();

    this.chart.snakeHead = this.chart.renderer
      .rect(this.initialX, this.initialY, this.size, this.size)
      .attr({ fill: 'rgb(51,85,139)', 'stroke-width': 1, stroke: 'white' })
      .add(this.svgGroup);

    this.segments.push(this.chart.snakeHead);
  }

  startGame() {
    this.addKeyDownListener();
    this.renderHead();
    this.startInterval();
  }

  resetGame() {
    this.setScore(0);
    this.svgGroup.destroy();
    this.translateX = 0;
    this.translateY = 0;
    this.direction = 'DOWN';
    this.segments.splice(0, this.segments.length);
    this.generateNewPoints();
    this.playAgainButton.destroy();
  }

  startInterval() {
    this.interval = setInterval(() => {
      this.onWallCollision();
      this.onPointCollision();
      this.onBodyCollision();
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
        const previousTranslate = {
          x: this.segments[index + 1].translateX,
          y: this.segments[index + 1].translateY,
        };
        segment.translate(previousTranslate.x, previousTranslate.y);
        if (segment.isNewAdded) {
          segment.isNewAdded = false;
        }
      }
    });
  }

  move(direction) {
    if (direction === 'UP' && this.isInsideAfterTranslation('UP')) {
      this.translateY -= this.size;
      this.translateSegments();
    } else if (direction === 'DOWN' && this.isInsideAfterTranslation('DOWN')) {
      this.translateY += this.size;
      this.translateSegments();
    } else if (
      direction === 'RIGHT' && this.isInsideAfterTranslation('RIGHT')) {
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
        return this.translateX + 2 * this.size <= this.chart.plotWidth;
      case 'LEFT':
        return this.translateX - this.size >= 0;
    }
  }

  getActualHeadPosition() {
    return {
      x: this.initialX + this.translateX,
      y: this.initialY + this.translateY,
    };
  }

  getDistanceBetween(pointA, pointB) {
    return Math.hypot(
      Math.abs(pointA.x - pointB.x),
      Math.abs(pointA.y - pointB.y),
    );
  }

  getCollidedPoint() {
    const { points } = this.chart.series[0];
    const actualHeadPosition = this.getActualHeadPosition();
    let collidedPoint = null;
    points.forEach((point) => {
      const pointPosition = {
        x: point.plotX + this.chart.plotLeft,
        y: point.plotY + this.chart.plotTop,
      };

      const distanceBetween = this.getDistanceBetween(
        actualHeadPosition,
        pointPosition,
      );

      if (distanceBetween < this.size) {
        collidedPoint = point;
      }
    });

    return collidedPoint;
  }

  detectWallCollision() {
    return !this.isInsideAfterTranslation(this.direction);
  }

  detectBodyCollision() {
    const actualHeadPosition = this.getActualHeadPosition();
    let isBodyCollision = false;
    this.segments.forEach((segment, index) => {
      if (index < this.segments.length - 1) {
        const segmentPosition = {
          x: this.initialX + segment.translateX,
          y: this.initialY + segment.translateY,
        };

        const isCollision = actualHeadPosition.x - segmentPosition.x === 0
          && actualHeadPosition.y - segmentPosition.y === 0
          && !segment.isNewAdded;
        if (isCollision) {
          isBodyCollision = true;
        }
      }
    });

    return isBodyCollision;
  }

  generateNewPoints() {
    this.chart.series[0].setData(getRandomData(5), false);
    this.chart.series[0].update({ color: getRandomColor() });
  }

  gameOver() {
    this.stopInterval();
    this.chart.update({
      title: {
        useHTML: true,
        text: `GAME OVER <br> Final score: ${this.score}`,
      },
    });
    this.playAgainButton = this.chart.renderer
      .button(
        'Play again!',
        this.chart.plotWidth / 2,
        this.chart.plotHeight / 2 + this.chart.plotTop,
      )
      .add()
      .on('click', () => {
        this.resetGame();
        this.startGame();
      });
    const playAgainButtonBBox = this.playAgainButton.getBBox();

    this.playAgainButton.translate(
      this.chart.plotWidth / 2 - playAgainButtonBBox.width / 2,
      this.chart.plotHeight / 2 + this.chart.plotTop - playAgainButtonBBox.height / 2,
    );
  }

  onWallCollision() {
    if (this.detectWallCollision()) {
      this.gameOver();
    }
  }

  onPointCollision() {
    const collidedPoint = this.getCollidedPoint();
    if (collidedPoint) {
      this.eat(collidedPoint);
      this.addBodySegment();
      this.setScore(1);
      if (this.chart.series[0].data.length === 0) {
        this.generateNewPoints();
      }
    }
  }

  onBodyCollision() {
    if (this.detectBodyCollision()) {
      this.gameOver();
    }
  }

  eat(point) {
    point.remove();
  }

  setScore(value) {
    if (value === 0) {
      this.score = 0;
    } else {
      this.score += value;
    }

    this.chart.update({
      title: {
        text: `Score: ${this.score}`,
      },
    });
  }

  getSegmentTransparency() {
    return this.segments.length > 25 ? 0.1 : 1.1 - this.segments.length / 25;
  }

  addBodySegment() {
    const bodySegment = this.chart.renderer
      .rect(this.initialX, this.initialY, this.size, this.size)
      .attr({
        fill: `rgba(51,85,139,${this.getSegmentTransparency()}`,
        'stroke-width': 1,
        stroke: 'white',
      })
      .add(this.svgGroup)
      .translate(this.translateX, this.translateY);

    bodySegment.isNewAdded = true;
    this.segments.unshift(bodySegment);
  }
}

export default Snake;
