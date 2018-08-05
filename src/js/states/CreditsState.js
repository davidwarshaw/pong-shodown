import Phaser from 'phaser';

import Background from '../prefabs/Background';

import HighScore from '../HighScore';
import Characters from '../Characters';
import Fonts from '../Fonts';
import Properties from '../Properties';

class CreditsState extends Phaser.State {
  init(playState) {
    this.playState = playState;
    this.characters = null;
    this.fonts = null;
    this.background = null;
  }

  create() {

    // Bind callbacks
    this.showMainMessage = this.showMainMessage.bind(this);
    this.showNextCredit = this.showNextCredit.bind(this);

    this.textStyle = Properties.textStyle;

    // Credits
    this.mainMessageText = 'Pong Shodown';
    this.creditText = [
      ['Art and Programing',
        'Dave Warshaw'],
      ['Phaser CE',
        'https://phaser.io/'],
      ['PikoPixel',
        'http://twilightedge.com/mac/pikopixel/'],
      ['phaser-es6-starter',
        'https://github.com/brenopolanski/phaser-es6-starter'],
      ['Inspired by Stefan Gagne\'s Pong Kombat',
        'http://stefangagne.com/twoflower/pongkombat']
    ];

    const { storyMode } = this.playState;

    this.characters = new Characters();
    this.fonts = new Fonts(this.game);

    const leftCharacter = this.characters
      .getByName(storyMode.playerCharacterName, true);
    const boss = this.characters.getEndBoss()[1];
    const leftBackground = leftCharacter.background;
    this.background = new Background(this.game, leftBackground);

    // Main Message
    this.messageFont = this.fonts.bigFontString('');
    const leftX = (this.game.width / 2) -
      (3 * this.messageFont.width / 2);
    this.message = this.game.add.image(
      leftX, this.game.height * (1 / 6),
      this.messageFont);
    this.message.scale.set(Properties.scaleRatio);

    // Credits
    const creditLeft = this.game.width * (1 / 4);
    const creditTop = this.game.height * (5 / 7);
    this.creditFontTop = this.fonts.mainFontString('');
    this.creditFontBottom = this.fonts.mainFontString('');
    this.creditTop = this.game.add.image(creditLeft, creditTop,
      this.creditFontTop);
    this.creditBottom = this.game.add.image(creditLeft, creditTop + (3 * 10),
      this.creditFontBottom);
    this.creditTop.scale.set(Properties.scaleRatio);
    this.creditBottom.scale.set(Properties.scaleRatio);

    // Start with credit 0
    this.currentCreditIndex = 0;

    // Paddle start and end positions
    const leftPaddleXBegin = (this.game.width * (6 / 7));
    const leftPaddleYBegin = -300;
    const leftPaddleXEnd = (this.game.width / 2);
    const leftPaddleYEnd = (this.game.height * (3 / 7));
    const leftPaddleMoveDuration = 3;

    const bossPaddleXBegin = (this.game.width * (5 / 7));
    const bossPaddleYBegin = -200;
    const bossPaddleXEnd = (this.game.width * (2 / 7));
    const bossPaddleYEnd = this.game.height + 200;
    const bossPaddleMoveDuration = 3;

    // Paddle images
    this.leftPaddle = this.game.add.image(
      leftPaddleXBegin, leftPaddleYBegin,
      leftCharacter.sprite);
    this.leftPaddle.anchor.setTo(0.5, 0.5);
    this.leftPaddle.scale.set(Properties.scaleRatio);

    this.bossPaddle = this.game.add.image(
      bossPaddleXBegin, bossPaddleYBegin,
      boss.sprite);
    this.bossPaddle.anchor.setTo(0.5, 0.5);
    this.bossPaddle.scale.set(Properties.scaleRatio);

    // Paddle tweens
    this.game.add.tween(this.leftPaddle)
      .to({ x: leftPaddleXEnd, y: leftPaddleYEnd },
        Phaser.Timer.SECOND * leftPaddleMoveDuration,
        Phaser.Easing.Linear.None, true)
      .onComplete.add(this.showMainMessage);

    this.game.add.tween(this.bossPaddle)
      .to({ x: bossPaddleXEnd, y: bossPaddleYEnd },
        Phaser.Timer.SECOND * bossPaddleMoveDuration,
        Phaser.Easing.Linear.None, true);

    // Roll the credits!
    const creditDelay = Phaser.Timer.SECOND * bossPaddleMoveDuration;

    // Run the repeat an extra time to switch states after the last credit
    const creditRepeats = this.creditText.length + 1;
    this.creditTimer = this.game.time.events
      .repeat(creditDelay, creditRepeats, this.showNextCredit);

    // Update the high scores
    HighScore.update(this.playState);
  }

  showMainMessage() {
    this.messageFont.setText(this.mainMessageText);
    const leftX = (this.game.width / 2) -
      (3 * this.messageFont.width / 2);
    this.message.x = leftX;
  }

  showNextCredit() {
    // If there are still credits to show, show them
    if (this.currentCreditIndex !== this.creditText.length) {
      this.creditFontTop
        .setText(this.creditText[this.currentCreditIndex][0]);
      this.creditFontBottom
        .setText(this.creditText[this.currentCreditIndex][1]);
      const topLeft = (this.game.width / 2) -
        (3 * this.creditFontTop.width / 2);
      const bottomLeft = (this.game.width / 2) -
        (3 * this.creditFontBottom.width / 2);
      this.creditTop.x = topLeft;
      this.creditBottom.x = bottomLeft;

      // Go to the next credit
      this.currentCreditIndex++;
    }
    else {
      // If there are no more credits to show, go back to the splash screen
      this.state.start('SplashState', true, false, this.playState);
    }
  }

  update() {
    // Make the boss paddle spin
    this.bossPaddle.rotation += (Math.PI / 45);
  }
}

export default CreditsState;
