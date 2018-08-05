import Phaser from 'phaser';

// Game properties.
export default {
  debugMode: false,
  gameWidth: 1200,
  gameHeight: 600,
  scaleRatio: 3,
  localStorageName: 'pong-showdown',
  random: new Phaser.RandomDataGenerator([1]),
  mode: { story: 'STORY', versus: 'VERSUS' },
  cameraFadeColor: '#000000',
  fadeInSeconds: 2,
  preRoundMessageSeconds: 1.5,
  postRoundMessageSeconds: 3.0,
  postDuelMessageSeconds: 3.5,
  speechSeconds: 1.5,
  minAiDifficulty: 1,
  maxAiDifficulty: 3,
  minNumberOfRounds: 3,
  maxNumberOfRounds: 7,
  textStyle: {
    font: '65px Arial',
    fill: '#ff0044',
    align: 'center'
  },
  leftPlayerKeys: {
    up: Phaser.KeyCode.W,
    down: Phaser.KeyCode.S,
    left: Phaser.KeyCode.A,
    right: Phaser.KeyCode.D,
    duelAction: Phaser.KeyCode.X,
    action: Phaser.KeyCode.L,
    special: Phaser.KeyCode.Q
  },
  rightPlayerKeys: {
    up: Phaser.KeyCode.I,
    down: Phaser.KeyCode.K,
    left: Phaser.KeyCode.J,
    right: Phaser.KeyCode.L,
    duelAction: Phaser.KeyCode.M,
    special: Phaser.KeyCode.O
  }
};
