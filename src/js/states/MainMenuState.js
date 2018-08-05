import Phaser from 'phaser';

import Background from '../prefabs/Background';
import RetroMenu from '../prefabs/RetroMenu';

import Fonts from '../Fonts';
import Properties from '../Properties';

class MainMenuState extends Phaser.State {
  init(playState) {
    this.playState = playState;
    this.fonts = null;
    this.background = null;
    this.logo = null;
  }

  create() {

    this.textStyle = Properties.textStyle;

    this.fonts = new Fonts(this.game);

    this.background = new Background(this.game, 'splashBackground');

    this.logo = this.game.add.sprite(
      this.game.width / 2, (this.game.height * 2) / 7, 'logo');
    this.logo.anchor.setTo(0.5, 0.5);
    this.logo.scale.set(Properties.scaleRatio);

    // If there is an existing story mode state, keep it
    const storyMenuItemLabel = this.playState.storyMode.playerCharacterName ?
      'CONTINUE STORY' :
      'STORY';
    const storyMenuItemState = this.playState.storyMode.playerCharacterName ?
      'StoryCharacterSelectState' :
      'CharacterSelectState';

    const storyCb = () => {
      // Set the mode to story mode
      this.playState.mode = Properties.mode.story;

      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start(storyMenuItemState, true, false,
          this.playState),
        this);
    };

    const versusCb = () => {
      // Set the mode to story mode
      this.playState.mode = Properties.mode.versus;

      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start('CharacterSelectState', true, false,
          this.playState),
        this);
    };

    const helpCb = () => {
      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start('HelpMenuState', true, false,
          this.playState),
        this);
    };

    const optionsCb = () => {
      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start('OptionsMenuState', true, false,
          this.playState),
        this);
    };

    const highScoresCb = () => {
      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start('HighScoreMenuState', true, false,
          this.playState),
        this);
    };

    const options = {
      freezeAfterSelection: true
    };

    this.items = [
      { label: storyMenuItemLabel, value: '', cb: storyCb },
      { label: 'VERSUS', value: '', cb: versusCb },
      { label: 'HIGH SCORES', value: '', cb: highScoresCb },
      { label: 'HELP', value: '', cb: helpCb },
      { label: 'OPTIONS', value: '', cb: optionsCb }
    ];
    this.menu = new RetroMenu(this.game, this.items, options);

    // Go to the main menu after a while
    this.game.time.events.add(
      Phaser.Timer.SECOND * Properties.fadeInSeconds * 2,
      () => {
        this.keysHint = this.game.add.sprite(
          (this.game.width * 1) / 6, (this.game.height * 6) / 7, 'keysHint');
        this.keysHint.anchor.setTo(0.5, 0.5);
        this.keysHint.scale.set(Properties.scaleRatio);
        this.keysHint.alpha = 0;
        this.game.add.tween(this.keysHint).to(
          { alpha: 0.30 }, Phaser.Timer.SECOND * Properties.fadeInSeconds,
          Phaser.Easing.Linear.None, true);
      }
    );
  }

  update() {
    this.menu.update();
  }
}

export default MainMenuState;
