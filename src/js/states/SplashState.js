import Phaser from 'phaser';

import Background from '../prefabs/Background';
import Petal from '../prefabs/Petal';

import Properties from '../Properties';

class SplashState extends Phaser.State {
  init() {
    this.background = null;
    this.logo = null;
    this.petals = null;
  }

  create() {

    this.textStyle = Properties.textStyle;
    const random = Properties.random;

    // Physics for the falling blossoms
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 1.0;
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);

    this.background = new Background(this.game, 'splashBackground');
    this.background.alpha = 0;
    this.game.add.tween(this.background).to(
      { alpha: 1 }, Phaser.Timer.SECOND * Properties.fadeInSeconds * 2,
      Phaser.Easing.Linear.None, true);

    this.logo = this.game.add.sprite(
      this.game.width / 2, (this.game.height * 2) / 7, 'logo');
    this.logo.anchor.setTo(0.5, 0.5);
    this.logo.scale.set(Properties.scaleRatio);
    this.logo.alpha = 0;
    this.game.add.tween(this.logo).to(
      { alpha: 1 }, Phaser.Timer.SECOND * Properties.fadeInSeconds,
      Phaser.Easing.Linear.None, true);

    const numPetals = 50;
    this.petals = Array(numPetals).fill().map(() => {
      const width = random.integerInRange(0, this.game.width);
      const height = 0 - Math.abs(random.normal() * 600);
      const animationSpeed = (random.normal() * 3) + 10;
      const fallSpeed = (random.normal() * 20) + 150;
      const driftSpeed = (random.normal() * 50) + 50;
      return new Petal(this.game,
        width, height, driftSpeed, fallSpeed, animationSpeed);
    });

    // Get the saved playstate if it exists. Otherwise make a new one.
    const playState = JSON.parse(localStorage.getItem('playState')) || {

      // Current mode
      mode: Properties.mode.story,

      // The current battle
      currentDuel: {
        roundNumber: 1,
        leftPaddleConfig: null,
        rightPaddleConfig: null,
        scores: []
      },

      // Progress in story mode
      storyMode: {
        playerCharacterName: null,
        currentOpponentIndex: 0,
        opponents: null,
        score: 0,

        // If true, then the next duel is the special duel
        specialDuel: false
      },

      // Game options
      options: {
        numberOfRounds: Properties.minNumberOfRounds,
        showCommandHints: false,
        aiDifficulty: Properties.minAiDifficulty
      },

      // High scores and locked characters
      highScores: [],
      whiteUnlocked: false,
      blackUnlocked: false
    };

    this.game.input.keyboard.onPressCallback = () => {

      // Clear the on press callback, so we can't trigger it again
      this.game.input.keyboard.onPressCallback = null;

      this.state.start('MainMenuState', true, false, playState);
    };

    // Go to the main menu after a while
    this.game.time.events.add(
      Phaser.Timer.SECOND * Properties.fadeInSeconds * 10,
      () => this.state.start('MainMenuState', true, false, playState)
    );
  }
}

export default SplashState;
