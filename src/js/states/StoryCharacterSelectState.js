import Phaser from 'phaser';

import Background from '../prefabs/Background';

import Characters from '../Characters';
import Fonts from '../Fonts';
import Properties from '../Properties';

class StoryCharacterSelectState extends Phaser.State {
  init(playState) {
    this.playState = playState;

    this.background = null;

    this.leftCharSelectFrame = null;

  }

  create() {

    // Bind callbacks
    this.rcToXy = this.rcToXy.bind(this);

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

    this.leftActivatedCharacter = null;
    this.rightActivatedCharacter = null;

    this.characters = new Characters();
    this.fonts = new Fonts(this.game);
    this.background = new Background(this.game, 'characterSelectScreen');

    // If there is no story mode progress, create it
    if (!this.playState.storyMode.playerCharacterName) {

      // Reset story mode progress
      this.playState.storyMode = {
        playerCharacterName: null,
        opponents: null,
        boss: null,
        special: null,
        currentOpponentIndex: 0,
        score: 0,
        specialDuel: null
      };

      // Assign the player character
      this.playState.storyMode.playerCharacterName =
                  this.playState.currentDuel.leftPaddleConfig.character.name;

      this.playState.storyMode.opponents = this.createCharacterOrder();
      this.playState.storyMode.boss = this.characters.getEndBossPortrait();
      this.playState.storyMode.special = this.characters.getSpecialPortrait();
      this.playState.storyMode.currentOpponentIndex = 0;
      this.playState.storyMode.specialDuel = false;
    }

    const {
      playerCharacterName, currentOpponentIndex, opponents
    } = this.playState.storyMode;
    const leftCharacter = this.characters.getPortraitByName(
      playerCharacterName);

    // After the opponents, fight the boss. Unless it's the special character
    let rightCharacter;
    if (this.playState.storyMode.specialDuel) {
      rightCharacter = this.characters.getSpecialPortrait();
    }
    else if (currentOpponentIndex >= opponents.length) {
      rightCharacter = this.characters.getEndBossPortrait();
    }
    else {
      const opponentName = opponents[currentOpponentIndex].name;
      rightCharacter = this.characters.getPortraitByName(opponentName);
    }

    // Update the play state with the characters for the next battle
    this.playState.currentDuel.leftPaddleConfig = {
      left: true,
      player: true,
      roundWins: 0,
      character: this.characters.getByName(
        playerCharacterName, true)
    };
    this.playState.currentDuel.rightPaddleConfig = {
      left: false,
      player: false,
      roundWins: 0,
      character: this.characters.getByName(
        rightCharacter.name, false)
    };

    // Set the round number to 1 and reset the duel scores
    this.playState.currentDuel.roundNumber = 1;
    this.playState.currentDuel.scores = [];

    // Save the play state
    localStorage.setItem('playState', JSON.stringify(this.playState));

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

    // Character Names
    this.leftNameFont = this.fonts.bigFontString(leftCharacter.name);
    const leftX = (this.game.width * (2 / 6)) -
      (3 * this.leftNameFont.width / 2);
    this.leftName = this.game.add.image(leftX, this.game.height * (1 / 6),
      this.leftNameFont);
    this.leftName.scale.set(Properties.scaleRatio);

    this.rightNameFont = this.fonts.bigFontString(rightCharacter.name);
    const rightX = (this.game.width * (4 / 6)) -
      (3 * this.rightNameFont.width / 2);
    this.rightName = this.game.add.image(rightX, this.game.height * (2 / 6),
      this.rightNameFont);
    this.rightName.scale.set(Properties.scaleRatio);

    this.portraits = [leftCharacter].concat(opponents)
      .map((characterPortrait, i) => {
        const { r, c } = this.iToRc(i);
        const { x, y } = this.rcToXy(r, c);

        // Future opponents should be covered
        const image = i > currentOpponentIndex + 1 ?
          'coverPortrait' :
          characterPortrait.portraitImage;
        const portrait = this.game.add.image(x, y, image);
        portrait.anchor.setTo(0.5, 0.5);
        portrait.scale.set(Properties.scaleRatio);

        // The player and past opponents shoudl be tinted
        if (i === 0 || i <= currentOpponentIndex) {
          portrait.tint = this.activatedTint;
        }
        return portrait;
      });

    // Add covered portraits to the boss positions
    const leftBossPos = this.rcToXy(1, 0);
    const leftBossPortrait = this.game.add.image(
      leftBossPos.x, leftBossPos.y, 'coverPortrait');
    leftBossPortrait.anchor.setTo(0.5, 0.5);
    leftBossPortrait.scale.set(Properties.scaleRatio);
    const rightBossPos = this.rcToXy(1, this.maxColumn);
    const rightBossPortrait = this.game.add.image(
      rightBossPos.x, rightBossPos.y, 'coverPortrait');
    rightBossPortrait.anchor.setTo(0.5, 0.5);
    rightBossPortrait.scale.set(Properties.scaleRatio);

    // Unfade from black
    this.camera.flash(Properties.cameraFadeColor);

    // Delay for a little bit and go to the battle
    this.game.time.events.add(
      Phaser.Timer.SECOND * Properties.preRoundMessageSeconds,
      () => this.state.start('SceneState', true, false, this.playState)
      , this);
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

  createCharacterOrder() {
    // Filter out bosses and shuffle
    const characters = this.characters.characterPortraits
      .flatten()
      .filter(character => !character.boss && !character.special &&
        character.name !== this.playState.storyMode.playerCharacterName);
    return this.shuffle(characters);
  }

  iToRc(i) {
    const r = Math.trunc(i / (this.maxColumn + 1));

    // 1, 0 is a boss, so if we're on row 1, shift columns to the right
    const c = r === 1 ?
      (i % (this.maxColumn + 1)) + 1 :
      i % (this.maxColumn + 1);
    return { r, c };
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

export default StoryCharacterSelectState;
