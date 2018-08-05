import Phaser from 'phaser';

import WorldMap from '../prefabs/WorldMap';

import Characters from '../Characters';
import Fonts from '../Fonts';
import Properties from '../Properties';

class SceneState extends Phaser.State {
  init(playState) {
    this.playState = playState;

    this.worldMap = null;

  }

  create() {

    // Bind callbacks
    this.zoomWorldMap = this.zoomWorldMap.bind(this);
    this.showCityName = this.showCityName.bind(this);
    this.showLeftSpeech = this.showLeftSpeech.bind(this);
    this.showRightSpeech = this.showRightSpeech.bind(this);

    this.textStyle = Properties.textStyle;

    // Portrait Constants
    this.leftActivatedCharacter = null;
    this.rightActivatedCharacter = null;

    this.characters = new Characters();
    this.fonts = new Fonts(this.game);

    this.worldMap = new WorldMap(this.game);
    this.worldMapZoomRatio = 1.25 * Properties.scaleRatio;

    // Get the characters from the playState
    const { leftPaddleConfig, rightPaddleConfig } = this.playState.currentDuel;
    const leftCharacter = this.characters.getPortraitByName(
      leftPaddleConfig.character.name);
    const rightCharacter = this.characters.getPortraitByName(
      rightPaddleConfig.character.name);

    // Get the x and y coords and the name of the right character's level
    this.cityX = this.characters.scenes[rightPaddleConfig.character.name]
      .location.x;
    this.cityY = this.characters.scenes[rightPaddleConfig.character.name]
      .location.y;
    this.cityName = this.characters.scenes[rightPaddleConfig.character.name]
      .location.name;
    this.leftSpeech = this.characters.scenes[leftPaddleConfig.character.name]
      .speech[rightPaddleConfig.character.name] ||
      this.characters.scenes[leftPaddleConfig.character.name].speech.default;
    this.rightSpeech = this.characters.scenes[rightPaddleConfig.character.name]
      .speech[leftPaddleConfig.character.name] ||
      this.characters.scenes[rightPaddleConfig.character.name].speech.default;

    // Big Portrait
    this.leftBigPortrait = this.game.add.image(
      this.game.width * (1 / 4), this.game.height * (2 / 3),
      leftCharacter.bigPortraitImage);
    this.leftBigPortrait.anchor.setTo(0.5, 0.5);

    this.rightBigPortrait = this.game.add.image(
      this.game.width * (3 / 4), this.game.height * (2 / 3),
      rightCharacter.bigPortraitImage);
    this.rightBigPortrait.anchor.setTo(0.5, 0.5);

    // Big portrait is five times larger
    this.leftBigPortrait.scale.set(Properties.scaleRatio * 5);
    this.rightBigPortrait.scale.set(Properties.scaleRatio * 5);

    // Tween the big portraits to their normal scale
    const leftScaleTween = this.game.add.tween(this.leftBigPortrait.scale)
      .to({ x: Properties.scaleRatio, y: Properties.scaleRatio },
        this.moveDuration, Phaser.Easing.Linear.None);

    const rightScaleTween = this.game.add.tween(this.rightBigPortrait.scale)
      .to({ x: Properties.scaleRatio, y: Properties.scaleRatio },
        this.moveDuration, Phaser.Easing.Linear.None);

    leftScaleTween.onComplete.add(this.zoomWorldMap, this);
    leftScaleTween.start();
    rightScaleTween.start();
  }

  zoomWorldMap() {
    // Rotate the map to the right city and zoom in
    const worldMapZoomTween = this.game.add.tween(this.worldMap.tileScale)
      .to({ x: this.worldMapZoomRatio, y: this.worldMapZoomRatio },
        this.moveDuration, Phaser.Easing.Linear.None);
    const worldMapRotateTween = this.game.add.tween(this.worldMap.tilePosition)
      .to({
        x: this.cityX * this.worldMapZoomRatio,
        y: this.cityY * this.worldMapZoomRatio
      }, this.moveDuration, Phaser.Easing.Linear.None);

    // When the zoom is complete, go to the next part of the sequence
    worldMapZoomTween.onComplete.add(this.showCityName, this);

    // Start the zoom
    worldMapZoomTween.start();
    worldMapRotateTween.start();
  }

  showCityName() {
    const cityNameFont = this.fonts.mainFontString(this.cityName);
    this.cityNameLabel = this.game.add.image(
      (this.game.width - (Properties.scaleRatio * cityNameFont.width)) / 2,
      this.game.height * (4 / 7),
      cityNameFont);
    this.cityNameLabel.scale.set(Properties.scaleRatio);

    this.showLeftSpeech();
  }

  showLeftSpeech() {
    let delayTime = Phaser.Timer.SECOND * 0;
    const firstRound = this.playState.storyMode.currentOpponentIndex === 0;
    const { boss, special } = this.playState.currentDuel.rightPaddleConfig;

    // Only show the left leftSpeech for the first fight, or for a boss fight
    if (firstRound || boss || special) {
      const leftSpeechBoxLeft = this.game.width * (1 / 3);
      const leftSpeechBoxTop = this.game.height * (1 / 9);
      this.leftSpeechBox = this.game.add.image(
        leftSpeechBoxLeft, leftSpeechBoxTop,
        'speechBox');
      this.leftSpeechBox.scale.set(Properties.scaleRatio);

      this.leftSpeechBoxMargin = (2 + 4) * Properties.scaleRatio;
      this.leftSpeechFont = this.fonts.mainFontString(this.leftSpeech);
      this.leftSpeechLabel = this.game.add.image(
        leftSpeechBoxLeft + this.leftSpeechBoxMargin,
        leftSpeechBoxTop + this.leftSpeechBoxMargin,
        this.leftSpeechFont);
      this.leftSpeechLabel.scale.set(Properties.scaleRatio);

      // If
      delayTime = Phaser.Timer.SECOND * Properties.speechSeconds;
    }

    // Delay and then go to the next part of the sequence
    this.game.time.events.add(
      delayTime,
      this.showRightSpeech, this);
  }

  showRightSpeech() {

    // Clean up left speech if it exists
    if (this.leftSpeechBox) {
      this.leftSpeechBox.destroy();
      this.leftSpeechFont.destroy();
    }

    const rightSpeechBoxLeft = this.game.width * (1 / 3);
    const rightSpeechBoxTop = this.game.height * (1 / 9);

    this.rightSpeechBox = this.game.add.image(
      rightSpeechBoxLeft, rightSpeechBoxTop,
      'speechBox');
    this.rightSpeechBox.scale.set(Properties.scaleRatio);

    // Mirror the rightSpeech box for the right rightSpeech
    this.rightSpeechBoxMargin = (2 + 4) * Properties.scaleRatio;
    this.rightSpeechBox.scale.x = -1 * this.rightSpeechBox.scale.x;

    // Speech box x is mirrored left to right
    this.rightSpeechBox.x = this.game.width - rightSpeechBoxLeft;

    this.rightSpeechFont = this.fonts.mainFontString(this.rightSpeech);
    this.rightSpeechLabel = this.game.add.image(
      (this.game.width - rightSpeechBoxLeft +
        this.rightSpeechBox.width + this.rightSpeechBoxMargin),
      rightSpeechBoxTop + this.rightSpeechBoxMargin,
      this.rightSpeechFont);
    this.rightSpeechLabel.scale.set(Properties.scaleRatio);

    // Delay for a little bit and go to the battle
    this.game.time.events.add(
      Phaser.Timer.SECOND * Properties.speechSeconds,
      () => {
        this.camera.fade(Properties.cameraFadeColor);
        this.camera.onFadeComplete.add(
          () => this.state.start('DuelState', true, false,
            this.playState),
          this);
      }, this);
  }
}

export default SceneState;
