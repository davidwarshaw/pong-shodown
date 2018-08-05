import Phaser from 'phaser';

import Background from '../prefabs/Background';
import Ref from '../prefabs/Ref';

import Ball from '../prefabs/Ball';
import Bomb from '../prefabs/Bomb';
import Onigiri from '../prefabs/Onigiri';

import Projectile from '../prefabs/Projectile';
import Goal from '../prefabs/Goal';
import Info from '../prefabs/Info';

import Ai from '../Ai';
import Factory from '../Factory';
import Fonts from '../Fonts';
import Properties from '../Properties';

class DuelState extends Phaser.State {

  init(playState) {

    this.fonts = null;

    this.playState = playState;

    this.background = null;
    this.ref = null;

    this.ball = null;
    this.bomb = null;
    this.onigiri = null;

    this.leftProjectile = null;
    this.leftPaddle = null;
    this.leftGoal = null;

    this.rightProjectile = null;
    this.rightPaddle = null;
    this.rightGoal = null;

    this.info = null;

    this.versus = this.playState.mode === Properties.mode.versus;
    this.boss = this.playState.currentDuel.rightPaddleConfig
      .character.boss;
    this.special = this.playState.currentDuel.rightPaddleConfig
      .character.special;

  }

  create() {

    // Bind callbacks
    this.roundOverCheck = this.roundOverCheck.bind(this);
    this.preRound = this.preRound.bind(this);
    this.postRound = this.postRound.bind(this);
    this.countDownScoresClosure = this.countDownScoresClosure.bind(this);
    this.endDuelClosure = this.endDuelClosure.bind(this);

    this.textStyle = Properties.textStyle;
    this.options = this.playState.options;
    const { leftPaddleConfig, rightPaddleConfig } = this.playState.currentDuel;

    // Flag to mark whether we're in the duel
    this.inRound = false;

    // Init physics
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 1.0;
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);
    this.game.physics.p2.setImpactEvents(true);

    this.fonts = new Fonts(this.game);

    // Create objects

    // If we're dueling the boss and we're in at least the second
    // round, showCommandHints the boss second background. Otherwise,
    // show the first background
    const rightBackground = this.boss &&
      this.playState.currentDuel.roundNumber > 1 ?
      rightPaddleConfig.character.secondBackground :
      rightPaddleConfig.character.background;
    this.background = new Background(this.game, rightBackground);

    this.ref = new Ref(this.game);

    this.ball = new Ball(this.game);
    this.bomb = new Bomb(this.game);
    this.onigiri = new Onigiri(this.game);

    const rightAi = !rightPaddleConfig.player;
    this.rightAi = null;
    if (rightAi) {
      this.rightAi = new Ai(this.game, this.playState);
    }

    this.leftProjectile = new Projectile(this.game, true,
      leftPaddleConfig.character.projectile);
    this.rightProjectile = new Projectile(this.game, false,
      rightPaddleConfig.character.projectile);

    this.leftPaddle = Factory.getPaddle(this.game, this.playState.mode,
      leftPaddleConfig, this.leftProjectile,
      this.ball);
    this.rightPaddle = Factory.getPaddle(this.game, this.playState.mode,
      rightPaddleConfig, this.rightProjectile,
      this.ball, this.rightAi);

    this.leftGoal = new Goal(this.game, leftPaddleConfig);
    this.rightGoal = new Goal(this.game, rightPaddleConfig);

    // If we're in story mode, put the current score in info
    // Negative one is ignored by info
    const currentScore = this.versus ? -1 : this.playState.storyMode.score;
    this.info = new Info(this.game, this.leftPaddle, this.rightPaddle,
      this.roundOverCheck,
      this.options.numberOfRounds, this.options.showCommandHints,
      currentScore);

    // Register opponent, info and items with projectile
    this.leftProjectile.registerObjects(this.rightPaddle, this.info,
      this.bomb, this.onigiri);
    this.rightProjectile.registerObjects(this.leftPaddle, this.info,
      this.bomb, this.onigiri);

    this.bomb.registerObjects(this.info);
    this.onigiri.registerObjects(this.info);

    // Register objects with goal
    this.leftGoal.registerObjects(this.rightPaddle, this.info, this.ball,
      this.leftPaddle);
    this.rightGoal.registerObjects(this.leftPaddle, this.info, this.ball,
      this.rightPaddle);

    // Register objects with AI
    if (rightAi) {
      this.rightAi.registerObjects(this.rightPaddle, this.ball,
        this.leftProjectile, this.bomb, this.onigiri);
    }

    // Collision physics
    this.game.physics.p2.updateBoundsCollisionGroup(true);

    const ballColliders = [
      this.bomb.collisionGroup,
      this.onigiri.collisionGroup,
      this.leftPaddle.collisionGroup,
      this.rightPaddle.collisionGroup,
      this.leftGoal.collisionGroup,
      this.rightGoal.collisionGroup
    ];

    // If the projectiles collide with the ball, add them to the collision group
    if (this.leftProjectile.config.collidesWithBall) {
      ballColliders.push(this.leftProjectile.collisionGroup);
    }
    if (this.rightProjectile.config.collidesWithBall) {
      ballColliders.push(this.rightProjectile.collisionGroup);
    }
    this.ball.body.collides(
      ballColliders,
      this.ball.hit);

    this.bomb.body.collides([
      this.ball.collisionGroup, this.onigiri.collisionGroup,
      this.leftProjectile.collisionGroup, this.rightProjectile.collisionGroup,
      this.leftPaddle.collisionGroup, this.rightPaddle.collisionGroup],
    this.bomb.hit);
    this.onigiri.body.collides([
      this.ball.collisionGroup, this.bomb.collisionGroup,
      this.leftProjectile.collisionGroup, this.rightProjectile.collisionGroup,
      this.leftPaddle.collisionGroup, this.rightPaddle.collisionGroup],
    this.onigiri.hit);

    this.leftProjectile.body.collides(
      [this.ball.collisionGroup,
        this.bomb.collisionGroup, this.onigiri.collisionGroup,
        this.rightPaddle.collisionGroup,
        this.rightGoal.collisionGroup],
      this.leftProjectile.hit);
    this.rightProjectile.body.collides(
      [this.ball.collisionGroup,
        this.bomb.collisionGroup, this.onigiri.collisionGroup,
        this.leftPaddle.collisionGroup,
        this.leftGoal.collisionGroup],
      this.rightProjectile.hit);

    // Class collides methods override body collides so that paddle
    // subclasses can add their collides
    this.leftPaddle.collides(
      [this.ball.collisionGroup,
        this.bomb.collisionGroup, this.onigiri.collisionGroup,
        this.rightProjectile.collisionGroup],
      this.leftPaddle.blockImpact);
    this.rightPaddle.collides(
      [this.ball.collisionGroup,
        this.bomb.collisionGroup, this.onigiri.collisionGroup,
        this.leftProjectile.collisionGroup],
      this.rightPaddle.blockImpact);

    this.leftGoal.body.collides(
      [this.ball.collisionGroup, this.rightProjectile.collisionGroup],
      this.leftGoal.goal);
    this.rightGoal.body.collides(
      [this.ball.collisionGroup, this.leftProjectile.collisionGroup],
      this.rightGoal.goal);

    // Un-fade from black the pre round stuff
    this.camera.flash(Properties.cameraFadeColor);
    this.preRound();
  }

  render() {
    const { showDebugSpriteInfo } = Properties;

    // Handle debug mode.
    if (__DEV__ && showDebugSpriteInfo) {
      this.game.debug.spriteInfo(this.lander, 35, 500);
    }
  }

  update() {
    this.info.update();

    // Round to first decimal place
    const roundSeconds = Phaser.Math.roundTo(
      this.game.time.totalElapsedSeconds() - this.roundBeginSeconds,
      -1);

    // Onigiri gets sent at 30s, bomb at 60s
    if (this.inRound && !this.onigiri.inPlay && roundSeconds === 60.0) {
      // Set inPlay so this isn't triggered more than once
      this.onigiri.inPlay = true;

      // Send onigiri to paddle that's losing
      const left = this.leftPaddle.health < this.rightPaddle.health;
      this.ref.approachThenRecede(this.onigiri.putIntoPlay, left);
    }
    if (this.inRound && !this.bomb.inPlay && roundSeconds === 90.0) {
      // Set inPlay so this isn't triggered more than once
      this.bomb.inPlay = true;

      // Send bomb to paddle that's winning
      const left = this.leftPaddle.health >= this.rightPaddle.health;
      this.ref.approachThenRecede(this.bomb.putIntoPlay, left);
    }
  }

  // This check is run only after the tween to decrease the
  // health bar, so that the round only ends after the bar hits zero
  roundOverCheck() {
    // Only end the round if we're in duel
    if (this.inRound) {
      // Check to see if someone has won the round
      if (this.leftPaddle.health <= 0) {
        // Right has won
        this.postRound(false);
      }
      else if (this.rightPaddle.health <= 0) {
        // Left has won
        this.postRound(true);
      }
    }
  }

  preRound() {

    const { roundNumber } = this.playState.currentDuel;

    const roundMessage = `Duel ${roundNumber}`;
    const beginMessage = 'Begin!';

    // Remove the items
    this.bomb.removeFromPlay();
    this.onigiri.removeFromPlay();

    // Reset the paddles
    this.leftPaddle.reset();
    this.rightPaddle.reset();

    // Put up the first message
    this.fightTextFont = this.fonts.bigFontString(roundMessage);
    const leftX = (this.game.width / 2) -
      (3 * this.fightTextFont.width / 2);
    this.fightText = this.game.add.image(
      leftX, this.game.height / 2,
      this.fightTextFont);
    this.fightText.scale.set(Properties.scaleRatio);

    // End the pre game after a few seconds
    this.game.time.events.add(
      Phaser.Timer.SECOND * Properties.preRoundMessageSeconds,
      () => {

        // Put up the second message
        this.fightTextFont.setText(beginMessage);
        const leftX = (this.game.width / 2) -
          (3 * this.fightTextFont.width / 2);
        this.fightText.x = leftX;

        this.game.time.events.add(
          Phaser.Timer.SECOND * Properties.preRoundMessageSeconds,
          () => {

            // Destroy the text
            this.fightText.destroy();
            this.fightTextFont.destroy();

            // Allow the paddles to receive input
            this.leftPaddle.allowInput = true;
            this.rightPaddle.allowInput = true;

            // Put the ball into play
            this.ball.putIntoPlay();

            // Recede the ref into the background
            this.ref.recede();

            // Start the round
            this.inRound = true;

            // Start the Timer
            this.roundBeginSeconds = this.game.time.totalElapsedSeconds();
          }, this);
      }, this);
  }

  postRound(leftWon) {

    // Take us out of duel
    this.inRound = false;

    // Get the elapsed seconds
    this.roundSeconds = this.game.time.totalElapsedSeconds() -
      this.roundBeginSeconds;

    // Remove the ball and projectiles from play
    this.ball.removeFromPlay();
    this.leftProjectile.removeFromPlay();
    this.rightProjectile.removeFromPlay();

    // Remove the items
    this.bomb.removeFromPlay();
    this.onigiri.removeFromPlay();

    // Have the ref approach
    this.ref.approach();

    // Prevent paddles from getting input
    this.leftPaddle.allowInput = false;
    this.rightPaddle.allowInput = false;

    const winner = leftWon ?
      this.leftPaddle :
      this.rightPaddle;
    const winnerProjectile = leftWon ?
      this.leftProjectile :
      this.rightProjectile;

    // Add this round score to the total
    this.addRoundScore(this.playState.currentDuel.roundNumber,

      // Special score is sum of specials and projectile hits
      winner.numberOfSpecials + winnerProjectile.numberOfHits,

      // Seconds score is the number of seconds the round lasts
      this.roundSeconds,

      // Life score is the percentage of life left
      winner.health / winner.maxHealth);

    // Award the round to the winner and check if they've won the match
    this.playState.currentDuel.roundNumber++;
    winner.config.roundWins++;

    // The winner of the round has won the match if they've won over
    // half the rounds
    const matchWon = winner.config.roundWins >
      (this.options.numberOfRounds / 2);

    const victoryMessage = Properties.random.between(0, 99) <= 95 ?
      'Victory!' : 'Victoly!';
    const winnerMessage = winner.config.character.name;
    const scoreMessage = 'Score';

    const firstMessage = matchWon ? victoryMessage : winnerMessage;

    // Put up the first message
    this.fightTextFont = this.fonts.bigFontString(firstMessage);
    const fontX = (this.game.width / 2) -
      (3 * this.fightTextFont.width / 2);
    this.fightText = this.game.add.image(
      fontX, this.game.height / 2,
      this.fightTextFont);
    this.fightText.scale.set(Properties.scaleRatio);

    // End the post game after a few seconds
    this.game.time.events.add(
      Phaser.Timer.SECOND * Properties.postRoundMessageSeconds,
      () => {

        // Put up the second message only if the match ws won
        if (matchWon) {

          // Determine if the next duel should be the special duel
          const flawless = winner.health === winner.maxHealth;
          const preSpecialCharacter =
            this.rightPaddle.config.character.preSpecial;
          this.playState.storyMode.specialDuel = !this.versus && leftWon &&
            flawless && preSpecialCharacter;

          // Calculate the scores for the duel
          this.calculateDuelScore(leftWon);

          // Put up the second message
          this.fightTextFont.setText(winnerMessage);
          const fontX = (this.game.width / 2) -
            (3 * this.fightTextFont.width / 2);
          this.fightText.x = fontX;

          this.game.time.events.add(
            Phaser.Timer.SECOND * Properties.postRoundMessageSeconds,
            () => {

              // We're displaying the score text count down
              this.scoreCountDownInProgress = true;

              // Put up the score text
              this.fightTextFont.setText(scoreMessage);
              const fontX = (this.game.width / 2) -
                (3 * this.fightTextFont.width / 2);
              const fontY = this.game.height / 4;
              this.fightText.x = fontX;
              this.fightText.y = fontY;

              // Score Text
              //
              const spacing = 3 * 10;
              const scoreWidth = 3 * 17 * 8;
              const valueWidth = 3 * 17 * 8;
              this.scoreFontImages = ['special', 'time', 'life', 'total']
                .map((score, i) => {
                  // Score label
                  const scoreFont = this.fonts.bigFontString(score.toString());
                  scoreFont.setFixedWidth(scoreWidth,
                    Phaser.RetroFont.ALIGN_LEFT);
                  const fontX = this.game.width * (1 / 4);
                  const fontY = this.fightText.y + (3 * spacing) +
                    (i * 3 * scoreFont.height) + (i * spacing);
                  const scoreText = this.game.add.image(
                    fontX, fontY,
                    scoreFont);
                  scoreText.scale.set(Properties.scaleRatio);

                  // Score value
                  const value = this.scores[score];
                  const valueFont = this.fonts.bigFontString(value.toString());
                  valueFont.setFixedWidth(valueWidth,
                    Phaser.RetroFont.ALIGN_RIGHT);
                  const valueText = this.game.add.image(
                    fontX + scoreWidth + spacing, fontY,
                    valueFont);
                  valueText.scale.set(Properties.scaleRatio);
                  return { scoreFont, scoreText, valueFont, valueText };
                });

              // Repeat the score count down
              // The count down can't be called too many times, but we'll set
              // a repeat for a few more calls then necessary so that the Timer
              // will clean itself up.
              const scoreTotal = this.scores.special + this.scores.time +
                this.scores.life;
              const approximateNumberOfCountDowns =
                Math.round(scoreTotal / 10) + 30;
              this.game.time.events.repeat(
                Phaser.Timer.SECOND * 0.01, approximateNumberOfCountDowns,
                this.countDownScoresClosure(leftWon), this);
            });
        }
        else {
          // Start the next round
          this.state.start('DuelState', true, false,
            this.playState);
        }
      }, this);
  }

  addRoundScore(roundNumber, specials, seconds, healthPercent) {
    this.playState.currentDuel.scores[roundNumber] =
      { specials, seconds, healthPercent };
  }

  calculateDuelScore(leftWon) {
    // Sum all the rounds scores
    const { special, time, life, specialTotal, timeTotal, healthTotal }
      = this.playState.currentDuel.scores.reduce(
        (acc, curr) => {
          // Don't count more than 10 specials
          const special = acc.special +
            Phaser.Math.clamp(curr.specials, 0, 10);

          // Don't count seconds elapsed beyond 90
          const time = acc.time +
            Phaser.Math.clamp(90 - curr.seconds, 0, 90);
          const life = acc.life + curr.healthPercent;

          const specialTotal = acc.specialTotal + 10;
          const timeTotal = acc.timeTotal + 90;
          const healthTotal = acc.healthTotal + 100;
          return { special, time, life, specialTotal, timeTotal, healthTotal };
        },
        { special: 0, time: 0, life: 0,
          specialTotal: 0, timeTotal: 0, healthTotal: 0 });

    // Set up the post round tally score values
    this.scores = {};
    this.scores.special = Math.round(10 * 100 * special / specialTotal);
    this.scores.time = Math.round(10 * 100 * time / timeTotal);
    this.scores.life = Math.round(10 * 100 * 100 * life / healthTotal);
    this.scores.total = 0;

    // Log the score with the story mode opponent
    if (!this.versus && leftWon) {

      const duelScore = this.scores.special +
        this.scores.time + this.scores.life;

      let opponent;
      if (this.boss) {
        opponent = this.playState.storyMode.boss;
      }
      else if (this.special) {
        opponent = this.playState.storyMode.special;
      }
      else {
        const opponentIndex = this.playState.storyMode.currentOpponentIndex;
        const opponents = this.playState.storyMode.opponents;
        opponent = opponents[opponentIndex];
      }

      // Add this score to the story mode running total
      opponent.score = duelScore;
      this.playState.storyMode.score += duelScore;
    }
  }

  countDownScoresClosure(leftWon) {
    return () => {
    // For this.scoreFontImages:
    // 0: special, 1: time, 2: life, 3: total
      if (this.scores.special > 0) {
        const increment = this.scores.special > 10 ? 10 : 1;
        this.scores.special -= increment;
        this.scoreFontImages[0]
          .valueFont.setText(this.scores.special.toString());

        this.scores.total += increment;
        this.scoreFontImages[3]
          .valueFont.setText(this.scores.total.toString());
      }
      else if (this.scores.time > 0) {
        const increment = this.scores.time > 10 ? 10 : 1;
        this.scores.time -= increment;
        this.scoreFontImages[1]
          .valueFont.setText(this.scores.time.toString());

        this.scores.total += increment;
        this.scoreFontImages[3]
          .valueFont.setText(this.scores.total.toString());
      }
      else if (this.scores.life > 0) {
        const increment = this.scores.life > 10 ? 10 : 1;
        this.scores.life -= increment;
        this.scoreFontImages[2]
          .valueFont.setText(this.scores.life.toString());

        this.scores.total += increment;
        this.scoreFontImages[3]
          .valueFont.setText(this.scores.total.toString());
      }

      // If the scores are counted down, but we're still in progress
      // then end the duel
      else if (this.scoreCountDownInProgress) {
      // We're done. Set a timer to end the duel
        this.game.time.events.add(
          Phaser.Timer.SECOND * Properties.postDuelMessageSeconds,
          this.endDuelClosure(leftWon));

        // We're no longer counting down now
        this.scoreCountDownInProgress = false;
      }
    };
  }

  endDuelClosure(leftWon) {

    return () => {
      let nextState;

      // If we're in versus mode, go back to the splash screen
      // otherwise, go on to the story character select
      if (this.versus) {
        nextState = 'SplashState';
      }
      else if (leftWon && this.boss) {
      // If the match is won in story mode against the boss
      // go to the credits
        this.playState.whiteUnlocked = true;
        nextState = 'CreditsState';
      }
      else if (leftWon && this.special) {
      // If the match is won in story mode against the special
      // character go to the next opponent
        this.playState.storyMode.specialDuel = false;
        this.playState.blackUnlocked = true;
        nextState = 'StoryCharacterSelectState';
      }
      else if (leftWon && this.playState.storyMode.specialDuel) {
      // If the match is won in story mode and the special duel
      // conditions have been met, then set up the special duel
        nextState = 'SpecialIntroState';
      }
      else if (leftWon) {
      // If the match is won in story mode, but it's not the boss,
      // then set up the next opponent
        this.playState.storyMode.currentOpponentIndex++;
        nextState = 'StoryCharacterSelectState';
      }
      else {
      // If the match is lost in story mode, go to the continue screen
        nextState = 'ContinueMenuState';
      }

      // The match is over, so go back to the prev state
      this.camera.fade(Properties.cameraFadeColor);
      this.camera.onFadeComplete.add(
        () => this.state.start(nextState, true, false,
          this.playState),
        this);
    };
  }
}

export default DuelState;
