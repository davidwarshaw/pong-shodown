import Phaser from 'phaser';

import Background from '../prefabs/Background';

import Characters from '../Characters';
import Properties from '../Properties';

class SpecialIntroState extends Phaser.State {
  init(playState) {
    this.playState = playState;
    this.characters = null;
    this.fonts = null;
    this.background = null;
  }

  create() {

    const { storyMode } = this.playState;

    this.characters = new Characters();

    const leftCharacter = this.characters
      .getByName(storyMode.playerCharacterName, true);
    const special = this.characters.getSpecial()[1];
    const specialBackground = special.background;
    this.background = new Background(this.game, specialBackground);

    // Paddle start and end positions
    const leftPaddleX = 120;
    const leftPaddleY = this.game.height / 2;

    const specialPaddleXBegin = this.game.width / 2;
    const specialPaddleYBegin = this.game.height * (3 / 4);
    const specialPaddleScaleBegin = 2.00;
    const specialPaddleXEnd = this.game.width - leftPaddleX;
    const specialPaddleYEnd = this.game.height / 2;
    const specialPaddleScaleEnd = Properties.scaleRatio;
    const specialPaddleMoveDuration = 2;

    // Paddle images
    this.leftPaddle = this.game.add.image(
      leftPaddleX, leftPaddleY,
      leftCharacter.sprite);
    this.leftPaddle.anchor.setTo(0.5, 0.5);
    this.leftPaddle.scale.set(Properties.scaleRatio);

    this.specialPaddle = this.game.add.image(
      specialPaddleXBegin, specialPaddleYBegin,
      special.sprite);
    this.specialPaddle.anchor.setTo(0.5, 0.5);
    this.specialPaddle.scale.set(specialPaddleScaleBegin);

    // Paddle tweens
    this.game.add.tween(this.specialPaddle.scale)
      .to({ x: specialPaddleScaleEnd, y: specialPaddleScaleEnd },
        Phaser.Timer.SECOND * specialPaddleMoveDuration,
        Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.specialPaddle)
      .to({ x: specialPaddleXEnd, y: specialPaddleYEnd },
        Phaser.Timer.SECOND * specialPaddleMoveDuration,
        Phaser.Easing.Linear.None, true)
      .onComplete.add(() => {
        // Fade out and go to the opponent select screen
        this.camera.fade(Properties.cameraFadeColor);
        this.camera.onFadeComplete.add(
          () => this.state.start('StoryCharacterSelectState', true, false,
            this.playState),
          this);
      });
  }

}

export default SpecialIntroState;
