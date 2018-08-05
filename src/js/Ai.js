
import Properties from './Properties';

class Ai {

  constructor(game, playState) {
    this.game = game;
    this.playState = playState;

    this.difficulty = this.playState.options.aiDifficulty;

    // Windows and thresholds are affected by the difficulty
    this.targetWindow = 50 - (10 * this.difficulty);
    this.projectileThreshold = 0 + (50 * (this.difficulty - 1));
    this.moveXThreshold = this.game.width - (500 * this.difficulty);
    this.ballWindowX = this.game.width / 8;
    this.ballNearOpponentThreshold = this.game.width / 2;
    this.ballCloseThreshold = (this.game.width * 3 / 4) -
      (100 * this.difficulty);

    this.moveInputStrategies = ['Fire-Projectile', 'Deflect-Ball', 'Teleport'];

    this.frameMs = 25;

    this.msCounter = 0;
    this.currentCbFrame = 0;
    this.keys = {
      up: { isDown: false },
      down: { isDown: false },
      left: { isDown: false },
      right: { isDown: false },
      action: { isDown: false }
    };

    this.reset();
  }

  registerObjects(paddle, ball, projectile, bomb, onigiri) {
    this.paddle = paddle;
    this.ball = ball;
    this.projectile = projectile;
    this.bomb = bomb;
    this.onigiri = onigiri;
    this.cb = paddle.cb;

    this.precalculate();
  }

  precalculate() {
    this.hasProjectileMove = this.paddle.config.character.moves
      .filter(move => (move.type === 'projectile'))
      .length > 0;
    this.hasChargeMove = this.paddle.config.character.moves
      .filter(move => (move.type === 'charge'))
      .length > 0;
    this.hasTeleportMove = this.paddle.config.character.moves
      .filter(move => (move.type === 'teleport'))
      .length > 0;

    this.paddleXCenter = ((this.paddle.xMax - this.paddle.xMin) / 2) +
      this.paddle.xMin;

    this.ballWindowY = this.paddle.height / 2;
  }

  reset() {
    // Clear the strategy
    this.strategy = '';
    this.targetY = this.game.height / 2;
    this.targetCalculatedFlag = false;
    this.moveInput = {};
    this.moveInputs = [];
  }

  getKeys() {
    // Add the elapsed time to the counter
    this.msCounter += this.game.time.elapsed;

    // If we've counted a full frame, determine
    // the input and reset the counter
    if (this.paddle && this.msCounter >= this.frameMs) {

      // Synchronize to the command buffer frame
      if (this.currentCbFrame !== this.cb.currentFrame) {
        this.setTargetY();
        this.currentCbFrame = this.cb.currentFrame;
      }

      this.resetKeys();
      this.determineInput();
      this.msCounter = 0;
      return this.keys;
    }
  }

  resetKeys() {
    this.keys.left.isDown = false;
    this.keys.right.isDown = false;
    this.keys.up.isDown = false;
    this.keys.down.isDown = false;
    this.keys.action.isDown = false;
  }

  screenThirdFromYIntercept(y) {
    if (y <= this.game.height / 3) {
      return 'top';
    }
    else if (y <= (this.game.height * 2 / 3)) {
      return 'middle';
    }
    return 'bottom';
  }

  halfScreenAwayFrom(y) {
    const halfScreen = this.game.height / 2;
    return y < halfScreen ? y + halfScreen : y - halfScreen;
  }

  calculateYIntercept(xIntercept, xPos, yPos, xVelocity, yVelocity) {
    const factor = Math.abs((xIntercept - xPos) / xVelocity);
    const unfoldedY = yPos + (factor * yVelocity);

    const numFolds = ~~(Math.round(unfoldedY) / Math.round(this.game.height));
    const foldedY = Math.round(unfoldedY) % Math.round(this.game.height);

    const yIntercept = numFolds % 2 === 0 ?
      Math.abs(foldedY) :
      this.game.height - Math.abs(foldedY);

    return Phaser.Math.clamp(yIntercept, 0, this.game.height);
  }

  setTargetY() {
    const ballComing = this.ball.body.velocity.x > 0;

    const projectileComing = this.projectile.isFired &&
      this.projectile.body.velocity.x > 0;

    const bombComing = this.bomb.inPlay &&
      this.bomb.body.velocity.x > 0;

    const onigiriComing = this.onigiri.inPlay &&
      this.onigiri.body.velocity.x > 0;

    const ballNearOpponent = !ballComing &&
      this.ball.body.x < this.ballNearOpponentThreshold;

    const ballJustLeft = !ballComing && !ballNearOpponent &&
      this.ball.body.x < this.ballCloseThreshold;
    const ballAlmostHere = ballComing &&
      this.ball.body.x < this.ballCloseThreshold;

    // First check if we can both avoid the projectile and return the ball
    if (ballComing && projectileComing) {
      if(this.strategy !== 'Avoid-Projectile-and-Return-Ball') {
        const ballYIntercept = this.calculateYIntercept(
          this.paddle.body.x, this.ball.body.x, this.ball.body.y,
          this.ball.body.velocity.x, this.ball.body.velocity.y);
        const projectileYIntercept = this.calculateYIntercept(
          this.paddle.body.x, this.projectile.body.x, this.projectile.body.y,
          this.projectile.body.velocity.x, this.projectile.body.velocity.y);

        // The ball intercept is far enough away from the projectile intercept
        const xGap = this.ball.body.x - this.projectile.body.x;
        const yGap = Math.abs(ballYIntercept - projectileYIntercept);
        if (xGap > this.ballWindowX || yGap > this.ballWindowY) {
          this.targetY = ballYIntercept;
          this.strategy = 'Avoid-Projectile-and-Return-Ball';
        }
      }
    }

    // If we shouldn't use the avoid and return strategy and it's set, reset it
    else if (this.strategy === 'Avoid-Projectile-and-Return-Ball') {
      this.strategy = '';
    }

    let ballYIntercept;
    let teleportYIntercept;
    let rightTeleportDestination;
    if (this.hasTeleportMove || this.hasChargeMove) {
      ballYIntercept = this.calculateYIntercept(
        this.paddle.body.x, this.ball.body.x, this.ball.body.y,
        this.ball.body.velocity.x, this.ball.body.velocity.y);
      teleportYIntercept = this.game.height - this.paddle.body.y;

      // Only teleport if it would be to the right place
      rightTeleportDestination =
        Math.abs(ballYIntercept - teleportYIntercept) < this.targetWindow;

    }

    // If we're not trying to both avoid the projectile and avoid the ball
    if (this.strategy !== 'Avoid-Projectile-and-Return-Ball') {
      // Trap strategy, but only recalculate target if strategy changed
      if (bombComing) {
        if (this.strategy !== 'Avoid-Bomb') {
          const bombYIntercept = this.calculateYIntercept(
            this.paddle.body.x, this.bomb.body.x, this.bomb.body.y,
            this.bomb.body.velocity.x, this.bomb.body.velocity.y);
          this.strategy = 'Avoid-Bomb';
          this.targetY = this.halfScreenAwayFrom(bombYIntercept);
        }
      }
      else if (onigiriComing) {
        if (this.strategy !== 'Get-Onigiri') {
          const onigiriYIntercept = this.calculateYIntercept(
            this.paddle.body.x, this.onigiri.body.x, this.onigiri.body.y,
            this.onigiri.body.velocity.x, this.onigiri.body.velocity.y);
          this.strategy = 'Get-Onigiri';
          this.targetY = onigiriYIntercept;
        }
      }
      else if (projectileComing) {
        if (this.strategy !== 'Avoid-Projectile') {
          const projectileYIntercept = this.calculateYIntercept(
            this.paddle.body.x, this.projectile.body.x, this.projectile.body.y,
            this.projectile.body.velocity.x, this.projectile.body.velocity.y);
          this.strategy = 'Avoid-Projectile';
          this.targetY = this.halfScreenAwayFrom(projectileYIntercept);
        }
      }
      else if (this.hasProjectileMove && ballNearOpponent) {
        if(this.strategy !== 'Fire-Projectile') {
          // Depending on the ball intercept, fire straight or at an angle
          const screenThird = this.screenThirdFromYIntercept(ballYIntercept);
          const projectileMoves = this.paddle.config.character.moves
            .filter(move => (move.type === 'projectile') &&
              (move.screenThirdHint === screenThird));

          const move = Properties.random.pick(projectileMoves);

          // Fire projectile more often if the difficulty is harder
          const clearToFire = Properties.random.between(0, 100) <=
            this.projectileThreshold;

          // If we've found a move, then queue it up to be executed
          if (move && clearToFire) {
            this.moveInputs = move.commands.slice();
            this.moveInputs.reverse();
            this.strategy = 'Fire-Projectile';
          }
        }
      }
      else if (this.hasChargeMove && (ballJustLeft || ballAlmostHere)) {
        if(this.strategy !== 'Deflect-Ball') {
          // Depending on the ball intercept, fire straight or at an angle
          const screenThird = this.screenThirdFromYIntercept(ballYIntercept);
          const projectileMoves = this.paddle.config.character.moves
            .filter(move => (move.type === 'charge') &&
              (move.screenThirdHint === screenThird));

          const move = Properties.random.pick(projectileMoves);

          // Deflect more often if the difficulty is harder
          const clearToFire = Properties.random.between(0, 100) <=
            this.projectileThreshold;

          // If we've found a move, then queue it up to be executed
          if (move && clearToFire) {
            this.moveInputs = move.commands.slice();
            this.moveInputs.reverse();
            this.strategy = 'Deflect-Ball';
          }
        }
      }
      else if (this.hasTeleportMove && ballComing && rightTeleportDestination) {
        if(this.strategy !== 'Teleport') {
          const projectileMoves = this.paddle.config.character.moves
            .filter(move => move.type === 'teleport');

          const move = Properties.random.pick(projectileMoves);

          // Teleport more often if the difficulty is harder
          const clearToTeleport =
            Properties.random.between(0, 100) <= this.projectileThreshold;

          // If we've found a move, then queue it up to be executed
          if (move && clearToTeleport) {
            this.moveInputs = move.commands.slice();
            this.moveInputs.reverse();
            this.strategy = 'Teleport';
          }
        }
      }
      else if (ballComing) {
        if(this.strategy !== 'Return-Ball') {
          const ballYIntercept = this.calculateYIntercept(
            this.paddle.body.x, this.ball.body.x, this.ball.body.y,
            this.ball.body.velocity.x, this.ball.body.velocity.y);

          // Return the ball if its close enough
          const closeEnough = this.ball.body.x > this.moveXThreshold;
          if (closeEnough) {
            this.strategy = 'Return-Ball';
            this.targetY = ballYIntercept;
          }
        }
      }
      else if (
        !bombComing && !onigiriComing && !projectileComing && !ballComing &&
      this.strategy !== 'Go-To-Center') {
        this.strategy = 'Go-To-Center';
        this.targetY = this.game.height / 2;
      }
    }

    // If the strategy is to fire a projectile or charge, queue up the next move
    if (this.moveInputStrategies.includes(this.strategy)) {
      this.moveInput = this.moveInputs.pop();
    }
  }

  determineInput() {
    // If we're firing a projectile put in the inputs
    if (this.moveInputStrategies.includes(this.strategy)) {
      switch (this.moveInput) {
        case 'up-left':
          this.keys.up.isDown = true;
          this.keys.left.isDown = true;
          break;
        case 'up-right':
          this.keys.up.isDown = true;
          this.keys.right.isDown = true;
          break;
        case 'down-left':
          this.keys.down.isDown = true;
          this.keys.left.isDown = true;
          break;
        case 'down-right':
          this.keys.down.isDown = true;
          this.keys.right.isDown = true;
          break;
        case 'up':
          this.keys.up.isDown = true;
          break;
        case 'down':
          this.keys.down.isDown = true;
          break;
        case 'left':
          this.keys.left.isDown = true;
          break;
        case 'right':
          this.keys.right.isDown = true;
          break;
        case 'button':
          this.keys.action.isDown = true;
          break;
        default:
          break;
      }
    }

    // If we're not firing a projectile, just move towards the target
    else if (this.targetY < this.paddle.y - this.targetWindow) {
      this.keys.up.isDown = true;
    }
    else if (this.targetY > this.paddle.y + this.targetWindow) {
      this.keys.down.isDown = true;
    }

    // Move back to the Center
    else if (this.paddleXCenter < this.paddle.x - this.targetWindow) {
      this.keys.left.isDown = true;
    }
    else if (this.paddleXCenter > this.paddle.x + this.targetWindow) {
      this.keys.right.isDown = true;
    }
  }

}

export default Ai;
