import Phaser from 'phaser';

import Arrow from './Arrow';
import Vs from './Vs';
import Win from './Win';

import Fonts from '../Fonts';
import Properties from '../Properties';

class Info {
  constructor(game, leftPaddle, rightPaddle, roundOverCheck,
    numberOfRounds, showCommandHints, currentScore) {
    this.game = game;
    this.leftPaddle = leftPaddle;
    this.rightPaddle = rightPaddle;
    this.roundOverCheck = roundOverCheck;
    this.numberOfRounds = numberOfRounds;
    this.showCommandHints = showCommandHints;
    this.currentScore = currentScore;

    this.fonts = new Fonts(game);

    // Health bar animation duration
    this.animationDuration = 500;

    this.executedCommandTint = 0x7777ff;

    // Alignment
    this.barWidth = 480;
    const barTop = 30;

    // 1200 * 2/5 = 480
    // 70 + 480 + 100 + 480 + 70 = 1200
    const betweenbars = 100;

    this.leftBarLeft = 70;
    const rightBarLeft = this.leftBarLeft
      + this.barWidth + betweenbars;

    this.leftMoveNameLeft = this.leftBarLeft + (this.barWidth / 2);

    const arrowsMargin = 40;
    const leftArrowsOffset = 9 * 12;
    const rightArrowsOffset = 1 * 12;
    const namesTop = barTop + 32;
    const arrowsTop = namesTop + 48;

    const winsTop = arrowsTop + 48;

    // Health bars
    this.leftHealthBar = new Phaser.Sprite(
      game, this.leftBarLeft, barTop, 'healthBar');
    this.leftHealthBar.scale.setTo(Properties.scaleRatio);
    game.add.existing(this.leftHealthBar);

    this.leftHealthFrame = new Phaser.Sprite(
      game, this.leftBarLeft, barTop, 'healthFrame');
    this.leftHealthFrame.scale.set(Properties.scaleRatio);
    game.add.existing(this.leftHealthFrame);

    this.rightHealthBar = new Phaser.Sprite(
      game, rightBarLeft, barTop, 'healthBar');
    this.rightHealthBar.scale.setTo(Properties.scaleRatio);
    game.add.existing(this.rightHealthBar);

    this.rightHealthFrame = new Phaser.Sprite(
      game, rightBarLeft, barTop, 'healthFrame');
    this.rightHealthFrame.scale.set(Properties.scaleRatio);
    game.add.existing(this.rightHealthFrame);

    // Arrow Arrays
    const numArrows = 10;
    if (this.showCommandHints) {
      this.leftArrows = [...Array(numArrows).keys()].map(i => {
        const x = this.leftBarLeft + leftArrowsOffset + (i * arrowsMargin);
        const arrow = new Arrow(game, x, arrowsTop);
        arrow.scale.set(Properties.scaleRatio);
        game.add.existing(arrow);
        arrow.visible = false;
        return arrow;
      });
      this.rightArrows = [...Array(numArrows).keys()].map(i => {
        const x = rightBarLeft + rightArrowsOffset + (i * arrowsMargin);
        const arrow = new Arrow(game, x, arrowsTop);
        arrow.scale.set(Properties.scaleRatio);
        game.add.existing(arrow);
        arrow.visible = false;
        return arrow;
      });
    }

    // Bind callbacks
    this.setLeftHealth = this.setLeftHealth.bind(this);
    this.setRightHealth = this.setRightHealth.bind(this);

    // Set the health bars to 100%
    this.setLeftHealth(1.0);
    this.setRightHealth(1.0);

    // Paddle Names
    const leftPaddleName = this.leftPaddle.config.character.name;
    const leftPaddleNameFont = this.fonts.mainFontString(leftPaddleName);
    this.leftPaddleName = game.add.image(this.leftBarLeft, namesTop,
      leftPaddleNameFont);
    this.leftPaddleName.scale.set(Properties.scaleRatio);
    const rightPaddleName = this.rightPaddle.config.character.name;
    const rightPaddleNameFont = this.fonts.mainFontString(rightPaddleName);
    const rightPaddleNameOffset = rightBarLeft +
      (this.rightHealthFrame.width -
        (Properties.scaleRatio * rightPaddleNameFont.width));
    this.rightPaddleName = game.add.image(rightPaddleNameOffset, namesTop,
      rightPaddleNameFont);
    this.rightPaddleName.scale.set(Properties.scaleRatio);

    // Paddle Move Names
    if (this.showCommandHints) {
      const leftPaddleMove = this.leftPaddle.cb.currentMoveName;
      this.leftPaddleMoveFont = this.fonts.mainFontString(leftPaddleMove);
      this.leftPaddleMove = game.add.image(this.leftMoveNameLeft, winsTop,
        this.leftPaddleMoveFont);
      this.leftPaddleMove.scale.set(Properties.scaleRatio);
      const rightPaddleMove = this.rightPaddle.cb.currentMoveName;
      this.rightPaddleMoveFont = this.fonts.mainFontString(rightPaddleMove);
      const rightPaddleMoveOffset = rightBarLeft +
      (this.rightHealthFrame.width -
        (Properties.scaleRatio * this.rightPaddleMoveFont.width)) -
      (this.rightHealthFrame.width / 2);
      this.rightPaddleMove = game.add.image(rightPaddleMoveOffset, winsTop,
        this.rightPaddleMoveFont);
      this.rightPaddleMove.scale.set(Properties.scaleRatio);

      // right paddle AI strategy display in debug mode
      if (Properties.debugMode && this.rightPaddle.ai) {
        this.rightPaddleStrategyFont = this.fonts
          .mainFontString(this.rightPaddle.ai.strategy);
        this.rightPaddleStrategy = game.add.image(
          rightPaddleMoveOffset, winsTop + 30,
          this.rightPaddleStrategyFont);
        this.rightPaddleStrategy.scale.set(Properties.scaleRatio);
      }

    }

    // Win markers
    const leftWins = this.leftPaddle.config.roundWins;
    const rightWins = this.rightPaddle.config.roundWins;
    this.leftWinMarkers = [...Array(leftWins)].map((_, i) => {
      const xPos = this.leftBarLeft +
        (arrowsMargin * (i + 1) * 1.5);
      return new Win(this.game, xPos, winsTop);
    });
    this.rightWinMarkers = [...Array(rightWins)].map((_, i) => {
      const xPos = (game.width - this.leftBarLeft) -
        (arrowsMargin * (i + 1) * 1.5);
      return new Win(this.game, xPos, winsTop);
    });

    // The VS icon
    const showKo = Math.max(leftWins, rightWins) + 1 >
      (this.numberOfRounds / 2);
    this.vsIcon = new Vs(game, game.width / 2, namesTop, showKo);

    // The current story mode score
    if (this.currentScore >= 0) {
      const scoreFont = this.fonts.mainFontString(currentScore.toString());
      this.score = game.add.image(this.leftBarLeft, this.game.height - namesTop,
        scoreFont);
      this.score.scale.set(Properties.scaleRatio);
    }

  }

  setLeftHealth(percent) {
    const x = this.leftBarLeft + ((1.0 - percent) * this.barWidth);
    const healthTween = this.game.add.tween(this.leftHealthBar)
      .to({ width: percent * this.barWidth, x },
        this.animationDuration, Phaser.Easing.Linear.None, true);

    // Check for a round winner after the tween, so that the round is over
    // only when the bar is empty
    healthTween.onComplete.add(this.roundOverCheck);
  }

  setRightHealth(percent) {
    const healthTween = this.game.add.tween(this.rightHealthBar)
      .to({ width: percent * this.barWidth },
        this.animationDuration, Phaser.Easing.Linear.None, true);

    // Check for a round winner after the tween, so that the round is over
    // only when the bar is empty
    healthTween.onComplete.add(this.roundOverCheck);
  }

  update() {
    if (this.leftPaddle && this.leftArrows) {
      this.updateArrowsFromCommandBuffer(
        this.leftPaddle.cb, this.leftArrows, true);
      this.updateLeftMoveName();
    }
    if (this.rightPaddle && this.rightArrows) {
      this.updateArrowsFromCommandBuffer(
        this.rightPaddle.cb, this.rightArrows, false);
      this.updateRightMoveName();
      this.updateStrategy();
    }
  }

  updateLeftMoveName() {
    if (this.showCommandHints &&
      this.leftPaddleMoveFont.text !== this.leftPaddle.cb.currentMoveName) {
      this.leftPaddleMoveFont.setText(this.leftPaddle.cb.currentMoveName);
    }
  }

  updateRightMoveName() {
    if (this.showCommandHints &&
      this.rightPaddleMoveFont.text !== this.rightPaddle.cb.currentMoveName) {
      this.rightPaddleMoveFont.setText(this.rightPaddle.cb.currentMoveName);
    }
  }

  updateStrategy() {
    if (Properties.debugMode && this.rightPaddle.ai) {
      this.rightPaddleStrategyFont.setText(this.rightPaddle.ai.strategy);
    }
  }

  updateArrowsFromCommandBuffer(cb, arrows, left) {
    const currentIndex = cb.currentFrame;
    cb.buffer.map((e, i) => {

      // Wrap the command buffer so the current frame is always at position 0
      const arrowOffset = i - currentIndex > 0 ?
        i - currentIndex : i - currentIndex + cb.numFrames - 1;

      // If this is the right buffer, reverse the direction
      const arrowIndex = left ?
        arrowOffset : cb.numFrames - 1 - arrowOffset;


      const arrow = arrows[arrowIndex];

      // If the arrow is part of an executed move, tint it
      arrow.tint = e.executed ? this.executedCommandTint : 0xffffff;
      arrow.animations.play('arrow');
      arrow.visible = true;

      switch (e.command) {
        case 'up-left':
          arrow.rotation = Math.PI * 1.75;
          break;
        case 'up-right':
          arrow.rotation = Math.PI * 0.25;
          break;
        case 'down-left':
          arrow.rotation = Math.PI * 1.25;
          break;
        case 'down-right':
          arrow.rotation = Math.PI * 0.75;
          break;
        case 'up':
          arrow.rotation = Math.PI * 0.0;
          break;
        case 'down':
          arrow.rotation = Math.PI * 1.0;
          break;
        case 'left':
          arrow.rotation = Math.PI * 1.5;
          break;
        case 'right':
          arrow.rotation = Math.PI * 0.5;
          break;
        case 'button':
          arrow.rotation = Math.PI * 0.0;
          arrow.animations.play('button');
          break;
        default:
          arrow.visible = false;
          break;
      }
    });
  }
}

export default Info;
