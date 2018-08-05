import Phaser from 'phaser';

import Background from '../prefabs/Background';
import RetroMenu from '../prefabs/RetroMenu';

import Fonts from '../Fonts';
import Properties from '../Properties';

class HighScoreMenuState extends Phaser.State {
  init(playState) {
    this.playState = playState;
    this.background = null;
    this.fonts = null;
    this.logo = null;
  }

  create() {

    this.textStyle = Properties.textStyle;

    this.fonts = new Fonts(this.game);

    this.background = new Background(this.game, 'splashBackground');

    const scoreLeft = Properties.scaleRatio * 70;
    const nameLeft = scoreLeft + (Properties.scaleRatio * 80);
    const dateLeft = nameLeft + (Properties.scaleRatio * 135);
    const top = Properties.scaleRatio * 15;
    const padding = (Properties.scaleRatio * 15);


    //{ name: "Grey Paddle", date: "7/21/2018", score: 3394 }

    // Write each high score line
    this.playState.highScores.forEach((highScore, i) => {
      const scoreFont = this.fonts.mainFontString(String(highScore.score));
      const scoreImage = this.game.add.image(scoreLeft, top + (i * padding),
        scoreFont);
      scoreImage.scale.set(Properties.scaleRatio);

      const nameFont = this.fonts.mainFontString(highScore.name);
      const nameImage = this.game.add.image(nameLeft, top + (i * padding),
        nameFont);
      nameImage.scale.set(Properties.scaleRatio);

      const dateFont = this.fonts.mainFontString(highScore.date);
      const dateImage = this.game.add.image(dateLeft, top + (i * padding),
        dateFont);
      dateImage.scale.set(Properties.scaleRatio);
    });

    const backCb = () => {
      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start('MainMenuState', true, false,
          this.playState),
        this);
    };

    const options = {
      menuTop: 530,
      freezeAfterSelection: false
    };

    this.items = [
      { label: 'BACK',
        value: '',
        cb: backCb }
    ];
    this.menu = new RetroMenu(this.game, this.items, options);
  }

  update() {
    this.menu.update();
  }
}

export default HighScoreMenuState;
