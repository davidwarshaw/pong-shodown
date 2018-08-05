import Phaser from 'phaser';

import Background from '../prefabs/Background';
import CharacterSelectFrame from '../prefabs/CharacterSelectFrame';

import Characters from '../Characters';
import Fonts from '../Fonts';
import Properties from '../Properties';

class CharacterSelectState extends Phaser.State {
  init(playState) {
    this.playState = playState;

    this.background = null;

    this.leftCharSelectFrame = null;
    this.rightCharSelectFrame = null;

    this.versus = this.playState.mode === Properties.mode.versus;

  }

  create() {

    // Bind callbacks
    this.rcToXy = this.rcToXy.bind(this);
    this.selectCharacter = this.selectCharacter.bind(this);
    this.activateCharacter = this.activateCharacter.bind(this);

    this.textStyle = Properties.textStyle;

    // Portrait Constants
    this.maxRow = 1;
    this.maxColumn = 4;
    this.characterFrameSize = 32 * Properties.scaleRatio;
    this.characterOffset = 4 * Properties.scaleRatio;
    this.firstRowTop = 366;
    this.firstColumnLeft = 408;

    this.leftStartingRow = 0;
    this.leftStartingColumn = 0;
    this.rightStartingRow = 0;
    this.rightStartingColumn = this.maxColumn;

    this.activatedTint = 0xff0000;

    this.allowActivation = false;
    this.leftActivatedCharacter = null;
    this.rightActivatedCharacter = null;

    this.characters = new Characters();
    this.fonts = new Fonts(this.game);
    this.background = new Background(this.game, 'characterSelectScreen');

    const cps = this.characters.characterPortraits;
    const leftCharacter = cps[this.leftStartingRow][this.leftStartingColumn];
    const rightCharacter = this.versus ?
      cps[this.rightStartingRow][this.rightStartingColumn] : null;

    // Big Portrait
    this.leftBigPortrait = this.game.add.image(
      this.game.width * (1 / 4), this.game.height * (2 / 3),
      leftCharacter.bigPortraitImage);
    this.leftBigPortrait.anchor.setTo(0.5, 0.5);

    // Big portrait is five times larger
    this.leftBigPortrait.scale.set(Properties.scaleRatio * 5);

    // Character Name
    this.leftNameFont = this.fonts.bigFontString(leftCharacter.name);
    const leftX = (this.game.width * (2 / 6)) -
      (3 * this.leftNameFont.width / 2);
    this.leftName = this.game.add.image(leftX, this.game.height * (1 / 6),
      this.leftNameFont);
    this.leftName.scale.set(Properties.scaleRatio);

    // Only show a right portrait and name if we're in versus mode
    if (this.versus) {
      // Big Portrait
      this.rightBigPortrait = this.game.add.image(
        this.game.width * (3 / 4), this.game.height * (2 / 3),
        rightCharacter.bigPortraitImage);
      this.rightBigPortrait.anchor.setTo(0.5, 0.5);

      // Big portrait is five times larger
      this.rightBigPortrait.scale.set(Properties.scaleRatio * 5);

      // Character Name
      this.rightNameFont = this.fonts.bigFontString(rightCharacter.name);
      const rightX = (this.game.width * (4 / 6)) -
        (3 * this.rightNameFont.width / 2);
      this.rightName = this.game.add.image(rightX, this.game.height * (2 / 6),
        this.rightNameFont);
      this.rightName.scale.set(Properties.scaleRatio);

    }

    this.portraits = this.characters.characterPortraits
      .map((rowOfCharacterPortraits, row) =>
        rowOfCharacterPortraits
          .map((characterPortrait, column) => {
            const { x, y } = this.rcToXy(row, column);

            const portrait = this.characterIsLocked(characterPortrait.name) ?
              this.game.add.image(x, y, 'coverPortrait') :
              this.game.add.image(x, y, characterPortrait.portraitImage);

            portrait.anchor.setTo(0.5, 0.5);
            portrait.scale.set(Properties.scaleRatio);

            return portrait;
          })
      );

    this.leftCharSelectFrame = new CharacterSelectFrame(
      this.game, this.playState.mode,
      this.leftStartingRow, this.leftStartingColumn, true,
      this.maxRow, this.maxColumn,
      this.rcToXy, this.selectCharacter, this.activateCharacter);

    // Register opponent character select frames
    this.leftCharSelectFrame.registerObjects(this.rightCharSelectFrame);

    // Only show a right character select frame if we're in versus mode
    if (this.versus) {
      this.rightCharSelectFrame = new CharacterSelectFrame(
        this.game, this.playState.mode,
        this.rightStartingRow, this.rightStartingColumn, false,
        this.maxRow, this.maxColumn,
        this.rcToXy, this.selectCharacter, this.activateCharacter);

      // Register opponent character select frames
      this.rightCharSelectFrame.registerObjects(this.leftCharSelectFrame);

    }

    // Unfade from black, but only allow activation after unfade is complete
    this.camera.flash(Properties.cameraFadeColor);
    this.camera.onFlashComplete.add(
      () => this.allowActivation = true,
      this);
  }

  rcToXy(row, column) {
    const x = this.firstColumnLeft + (column * this.characterFrameSize);
    let y = this.firstRowTop + (row * this.characterFrameSize);
    if (column >= 1 && column <= 3) {
      y -= this.characterOffset;
    }
    if (column >= 2 && column <= 2) {
      y -= this.characterOffset;
    }
    return { x, y };
  }

  characterIsLocked(name) {
    return (name === 'White Paddle' && !this.playState.whiteUnlocked) ||
      (name === 'Black Paddle' && !this.playState.blackUnlocked);
  }

  selectCharacter(left, row, column) {
    const bigPortrait = left ? this.leftBigPortrait : this.rightBigPortrait;
    const name = this.characters.characterPortraits[row][column].name;
    const nameFont = left ? this.leftNameFont : this.rightNameFont;
    const characterLocked = this.characterIsLocked(name);

    const nameDisplay = characterLocked ? '???????' : name;
    nameFont.setText(nameDisplay);

    bigPortrait.loadTexture(
      this.characters.characterPortraits[row][column].bigPortraitImage);
    if (characterLocked) {
      bigPortrait.tint = 0x000000;
    }
    else {
      bigPortrait.tint = 0xFFFFFF;
    }
  }

  activateCharacter(left, row, column) {
    // If we're not allowing activation yet, then early exit
    if (!this.allowActivation) {
      // We have not activated a character
      return false;
    }
    const name = this.characters.characterPortraits[row][column].name;

    // If the character is locked, early exit
    if (this.characterIsLocked(name)) {
      // We have not activated a character
      return false;
    }

    if (left) {
      this.leftActivatedCharacter = name;
      this.playState.currentDuel.leftPaddleConfig = {
        left: true,
        player: true,
        roundWins: 0,
        character: this.characters.getByName(name, true)
      };
    }
    else {
      this.rightActivatedCharacter = name;
      this.playState.currentDuel.rightPaddleConfig = {
        left: false,
        player: true,
        roundWins: 0,
        character: this.characters.getByName(name, false)
      };
    }

    // Tint activated characters
    this.portraits[row][column].tint = this.activatedTint;

    // If we've activated a character, or we're in versus mode and both
    // characters are activated, fade to black and start the game.
    if ((this.leftActivatedCharacter && !this.versus) ||
      (this.versus &&
        this.leftActivatedCharacter && this.rightActivatedCharacter)) {
      // If we're in versus mode, the next state is the battle. If we're
      // in story mode, we need to go to the screen where the opponents
      // are shown.
      const nextState = this.versus ? 'DuelState' : 'StoryCharacterSelectState';

      // Set the round number to 1 and reset the duel scores
      this.playState.currentDuel.roundNumber = 1;
      this.playState.currentDuel.scores = [];

      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start(nextState, true, false, this.playState),
        this);
    }

    // We have activated a character
    return true;
  }
}

export default CharacterSelectState;
