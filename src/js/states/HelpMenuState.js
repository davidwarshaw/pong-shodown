import Phaser from 'phaser';

import Background from '../prefabs/Background';
import RetroMenu from '../prefabs/RetroMenu';

import Fonts from '../Fonts';
import Properties from '../Properties';

class HelpMenuState extends Phaser.State {
  init(playState) {
    this.playState = playState;
    this.background = null;
    this.keysHelp = null;
    this.fonts = null;
    this.logo = null;
  }

  create() {

    this.textStyle = Properties.textStyle;

    this.fonts = new Fonts(this.game);

    this.background = new Background(this.game, 'splashBackground');
    this.keysHelp = new Background(this.game, 'keys');

    const backCb = () => {
      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start('MainMenuState', true, false,
          this.playState),
        this);
    };

    const options = {
      menuTop: 500,
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

export default HelpMenuState;
