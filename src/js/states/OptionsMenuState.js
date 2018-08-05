import Phaser from 'phaser';

import Background from '../prefabs/Background';
import RetroMenu from '../prefabs/RetroMenu';

import Fonts from '../Fonts';
import Properties from '../Properties';

class OptionsMenuState extends Phaser.State {
  init(playState) {
    this.playState = playState;
    this.fonts = null;
    this.background = null;
  }

  create() {

    this.textStyle = Properties.textStyle;

    this.fonts = new Fonts(this.game);

    this.background = new Background(this.game, 'splashBackground');

    const difficultyCb = () => {
      this.playState.options.aiDifficulty += 1;
      if (this.playState.options.aiDifficulty
          > Properties.maxAiDifficulty) {
        this.playState.options.aiDifficulty = Properties.minAiDifficulty;
      }

      // Return a strong to populate the new label value
      return String(this.playState.options.aiDifficulty);
    };

    const roundsCb = () => {
      this.playState.options.numberOfRounds += 2;
      if (this.playState.options.numberOfRounds
        > Properties.maxNumberOfRounds) {
        this.playState.options.numberOfRounds = Properties.minNumberOfRounds;
      }

      // Return a strong to populate the new label value
      return String(this.playState.options.numberOfRounds);
    };

    const showCommandsCb = () => {
      this.playState.options.showCommandHints =
        !this.playState.options.showCommandHints;

      // Return a strong to populate the new label value
      return String(this.playState.options.showCommandHints);
    };

    const clearStoryCb = () => {
      // Clear story progress
      this.playState.storyMode.playerCharacterName = null;

      // Save the play state
      localStorage.setItem('playState', JSON.stringify(this.playState));

      // Return a string to populate the new label value
      return 'NONE';
    };

    const backCb = () => {
      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start('MainMenuState', true, false,
          this.playState),
        this);
    };

    const options = {
      menuTop: 200,
      freezeAfterSelection: false
    };

    const initialClearStoryValue =
      this.playState.storyMode.playerCharacterName || 'NONE';
    this.items = [
      { label: 'DIFFICULTY',
        value: `${this.playState.options.aiDifficulty}`,
        cb: difficultyCb },
      { label: 'ROUNDS PER DUEL',
        value: `${this.playState.options.numberOfRounds}`,
        cb: roundsCb },
      { label: 'SHOW COMMANDS',
        value: `${this.playState.options.showCommandHints}`,
        cb: showCommandsCb },
      { label: 'CLEAR STORY',
        value: `${initialClearStoryValue}`,
        cb: clearStoryCb },
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

export default OptionsMenuState;
