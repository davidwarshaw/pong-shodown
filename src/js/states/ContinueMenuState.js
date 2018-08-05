import Phaser from 'phaser';

import Background from '../prefabs/Background';
import RetroMenu from '../prefabs/RetroMenu';

import HighScore from '../HighScore';
import Fonts from '../Fonts';
import Properties from '../Properties';

class ContinueMenuState extends Phaser.State {
  init(playState) {
    this.playState = playState;
    this.characters = null;
    this.fonts = null;
    this.background = null;
  }

  create() {

    this.textStyle = Properties.textStyle;

    const { leftPaddleConfig } = this.playState.currentDuel;

    this.fonts = new Fonts(this.game);
    this.background = new Background(this.game, 'splashBackground');

    // Continue message
    this.messageFont = this.fonts.bigFontString('Continue?');
    const leftX = (this.game.width / 2) -
      (3 * this.messageFont.width / 2);
    this.message = this.game.add.image(
      leftX, this.game.height * (1 / 6),
      this.messageFont);
    this.message.scale.set(Properties.scaleRatio);

    // Paddle
    const xOffset = -80;
    const xStart = (this.game.width / 2) - (xOffset / 2);
    const yOffset = 50;
    const yStart = (this.game.height * (3 / 7)) - (yOffset / 2);
    const moveDuration = 0.25;

    this.paddle = this.game.add.image(
      xStart + xOffset, yStart + yOffset,
      leftPaddleConfig.character.sprite);
    this.paddle.anchor.setTo(0.5, 0.5);
    this.paddle.scale.set(Properties.scaleRatio);

    // Start the paddle out on it's side
    this.paddle.rotation = Math.PI / 2;

    const continueCb = () => {
      const rotation = 0;
      const x = xStart;
      const y = yStart;

      // If we're continuing, raise the paddle up
      this.game.add.tween(this.paddle)
        .to({ rotation, x, y },
          Phaser.Timer.SECOND * moveDuration,
          Phaser.Easing.Linear.None, true)
        .onComplete.add(() => {
          // Fade out and go to the opponent select screen
          this.camera.fade(Properties.cameraFadeColor);
          this.camera.onFadeComplete.add(
            () => this.state.start('StoryCharacterSelectState', true, false,
              this.playState),
            this);
        });
    };

    const gameOverCb = () => {
      // Update the high scores (this clears the story mode)
      HighScore.update(this.playState);

      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start('MainMenuState', true, false,
          this.playState),
        this);
    };

    const options = {
      freezeAfterSelection: false
    };

    this.items = [
      { label: 'CONTINUE',
        value: '',
        cb: continueCb },
      { label: 'GAME OVER',
        value: '',
        cb: gameOverCb }
    ];
    this.menu = new RetroMenu(this.game, this.items, options);
  }

  update() {
    this.menu.update();
  }
}

export default ContinueMenuState;
