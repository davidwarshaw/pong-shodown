import 'pixi';
import 'p2';
import Phaser from 'phaser';
import Stats from 'stats.js';
import '../css/game.css';

//import MainMenuState from './states/MainMenuState';
import BootState from './states/BootState';
import PreloaderState from './states/PreloaderState';
import SplashState from './states/SplashState';
import MainMenuState from './states/MainMenuState';
import HighScoreMenuState from './states/HighScoreMenuState';
import HelpMenuState from './states/HelpMenuState';
import OptionsMenuState from './states/OptionsMenuState';
import ContinueMenuState from './states/ContinueMenuState';
import SpecialIntroState from './states/SpecialIntroState';
import CharacterSelectState from './states/CharacterSelectState';
import StoryCharacterSelectState from './states/StoryCharacterSelectState';
import SceneState from './states/SceneState';
import DuelState from './states/DuelState';
import CreditsState from './states/CreditsState';

import Properties from './Properties';

class Game extends Phaser.Game {
  constructor() {
    const {
      gameWidth,
      gameHeight,
      showStats
    } = Properties;

    super(gameWidth, gameHeight, Phaser.CANVAS, 'game-container');

    this.state.add('BootState', BootState);
    this.state.add('PreloaderState', PreloaderState);
    this.state.add('SplashState', SplashState);
    this.state.add('MainMenuState', MainMenuState);
    this.state.add('HighScoreMenuState', HighScoreMenuState);
    this.state.add('HelpMenuState', HelpMenuState);
    this.state.add('OptionsMenuState', OptionsMenuState);
    this.state.add('ContinueMenuState', ContinueMenuState);
    this.state.add('SpecialIntroState', SpecialIntroState);
    this.state.add('CharacterSelectState', CharacterSelectState);
    this.state.add('StoryCharacterSelectState', StoryCharacterSelectState);
    this.state.add('SceneState', SceneState);
    this.state.add('DuelState', DuelState);
    this.state.add('CreditsState', CreditsState);

    // Now start the Boot state.
    this.state.start('BootState');

    // Handle debug mode.
    if (__DEV__ && showStats) {
      this.setupStats();
    }
  }

  /**
   * Display the FPS and MS using Stats.js.
   */
  setupStats() {
    // Setup the new stats panel.
    const stats = new Stats();

    document.body.appendChild(stats.dom);

    // Monkey-patch the update loop so we can track the timing.
    const updateLoop = this.update;

    this.update = (...args) => {
      stats.begin();
      updateLoop.apply(this, args);
      stats.end();
    };
  }

}

window.game = new Game();
