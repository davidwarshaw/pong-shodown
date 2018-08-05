import Phaser from 'phaser';

import Smoke from './Smoke';

import CommandBuffer from '../CommandBuffer';

import Properties from '../Properties';

class Paddle extends Phaser.Sprite {
  constructor(game, mode, config, projectile, ball, ai) {
    super(game, 0, 0, config.character.sprite);

    this.game = game;
    this.config = config;
    this.projectile = projectile;
    this.ball = ball;
    this.ai = ai;

    // Initially, don't allow the paddles to be moved
    this.allowInput = false;

    // Track if the paddle is blocking
    this.blocking = false;

    // Moving the paddle manually means it has no velocity
    // so velocity must be manually tracked
    this.lastY = 0;
    this.yVelocity = 0;

    this.maxHealth = this.config.character.health;
    this.health = this.maxHealth;

    this.speed = this.config.character.speed;
    this.ballDamage = this.config.character.ballDamage;

    this.posOffset = 120;

    // Stats to keep track of for scoring
    this.numberOfSpecials = 0;

    // Reset the position and health
    this.reset();

    // Paddle horizontal bounds
    const horizontalMin = 30;
    const horizontalMax = 250;

    // Min and max are reversed from left to right
    this.xMin = config.left ? horizontalMin : game.width - horizontalMax;
    this.xMax = config.left ? horizontalMax : game.width - horizontalMin;

    this.animations.add('still', [0], 1, true);
    this.animations.play('still');

    this.scale.set(Properties.scaleRatio);

    this.anchor.setTo(0.5, 0.5);

    // Save the original texture to restore color flashing
    this.originalTexture = this.texture;

    // Physics
    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.P2JS, Properties.debugMode);
    this.body.collisionId = 'Paddle';

    this.body.kinematic = true;
    this.body.collideWorldBounds = true;

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);

    // Body to sprite pointer
    this.body.spritePointer = this;

    // Command buffer
    this.cb = new CommandBuffer(game);

    // Set the correct keys
    if (config.left) {
      // Clone left keys, so we don't mutate them
      const leftKeys = JSON.parse(JSON.stringify(Properties.leftPlayerKeys));

      // If we're not in versus mode, then use main action as the duel action
      if (mode !== Properties.mode.versus) {
        leftKeys.duelAction = leftKeys.action;
      }
      this.keys = game.input.keyboard.addKeys(leftKeys);
    }
    else {
      this.keys = game.input.keyboard.addKeys(Properties.rightPlayerKeys);
    }

    // Add signal for keys with single presses
    this.keys.duelAction.onDown.add(this.action, this);

    // In debug mode allow single button special moves
    if (Properties.debugMode) {
      this.keys.special.onDown.add(this.fireProjectile, this);
    }


    // Bind callbacks
    this.goalImpact = this.goalImpact.bind(this);
    this.blockImpact = this.blockImpact.bind(this);
    this.clearImpact = this.clearImpact.bind(this);
  }

  collides(collisionGroupArray) {
    this.body.collides(collisionGroupArray);
  }

  calculateVelocity() {
    this.yVelocity = this.body.y - this.lastY;
    this.lastY = this.body.y;
  }

  update() {
    this.cb.update();
    this.calculateVelocity();

    // If the paddle allow input, process it
    if (this.allowInput) {
      if (this.config.player) {
        this.processPlayerInput();
      }
      else {
        this.processAiInput();
      }
    }
  }

  processPlayerInput() {
    if (this.keys.up.isDown && this.keys.left.isDown) {
      this.moveUpLeft();
    }
    else if (this.keys.up.isDown && this.keys.right.isDown) {
      this.moveUpRight();
    }
    else if (this.keys.down.isDown && this.keys.left.isDown) {
      this.moveDownLeft();
    }
    else if (this.keys.down.isDown && this.keys.right.isDown) {
      this.moveDownRight();
    }
    else if (this.keys.up.isDown) {
      this.moveUp();
    }
    else if (this.keys.down.isDown) {
      this.moveDown();
    }
    else if (this.keys.left.isDown) {
      this.moveLeft();
    }
    else if (this.keys.right.isDown) {
      this.moveRight();
    }
  }

  processAiInput() {
    // If there are no AI key inputs, don't do anything
    const aiKeys = this.ai.getKeys();
    if (!aiKeys) {
      return;
    }
    if (aiKeys.up.isDown && aiKeys.left.isDown) {
      this.moveUpLeft();
    }
    else if (aiKeys.up.isDown && aiKeys.right.isDown) {
      this.moveUpRight();
    }
    else if (aiKeys.down.isDown && aiKeys.left.isDown) {
      this.moveDownLeft();
    }
    else if (aiKeys.down.isDown && aiKeys.right.isDown) {
      this.moveDownRight();
    }
    else if (aiKeys.up.isDown) {
      this.moveUp();
    }
    else if (aiKeys.down.isDown) {
      this.moveDown();
    }
    else if (aiKeys.left.isDown) {
      this.moveLeft();
    }
    else if (aiKeys.right.isDown) {
      this.moveRight();
    }

    // AI handles the action key through the update
    if (aiKeys.action.isDown) {
      this.action();
    }
  }

  moveUpLeft() {
    this.body.y = Phaser.Math.clamp(this.body.y - this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.body.x = Phaser.Math.clamp(this.body.x - this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('up-left');
  }
  moveUpRight() {
    this.body.y = Phaser.Math.clamp(this.body.y - this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.body.x = Phaser.Math.clamp(this.body.x + this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('up-right');
  }
  moveDownLeft() {
    this.body.y = Phaser.Math.clamp(this.body.y + this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.body.x = Phaser.Math.clamp(this.body.x - this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('down-left');
  }
  moveDownRight() {
    this.body.y = Phaser.Math.clamp(this.body.y + this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.body.x = Phaser.Math.clamp(this.body.x + this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('down-right');
  }
  moveUp() {
    this.body.y = Phaser.Math.clamp(this.body.y - this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.cb.pushCommand('up');
  }
  moveDown() {
    this.body.y = Phaser.Math.clamp(this.body.y + this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.cb.pushCommand('down');
  }
  moveLeft() {
    this.body.x = Phaser.Math.clamp(this.body.x - this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('left');
  }
  moveRight() {
    this.body.x = Phaser.Math.clamp(this.body.x + this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('right');
  }
  action() {
    // If the paddle allow input, process the action
    if (this.allowInput) {
      this.cb.pushCommand('button');
      this.specialMove();
      this.blockImpact();
    }
  }

  specialMove() {
    const move = this.cb.search(this.config.character.moves);
    if (move) {

      // Increment the special move count
      this.numberOfSpecials++;

      // Projectile move
      if (move.type === 'projectile') {
        this.fireProjectile(move);
      }

      // Teleport move
      if (move.type === 'teleport') {
        this.teleport(move);
      }

      // Charge move
      // Used by paddle with sidekick
      if (move.type === 'charge') {
        this.charge(move);
      }
    }
  }

  fireProjectile(move) {
    // Only one projectile allowed at a time and only when input is allowed
    if (this.projectile.isFired || !this.allowInput) {
      return;
    }

    // The projectile should come out a little forward of the paddle
    const x = this.config.left ?
      this.x + (this.width / 2) :
      this.x - (this.width / 2);

    // Fire the projectile
    this.projectile.fire(x, this.y, move);
  }

  teleport() {
    // Add smoke to current position
    this.smoke = new Smoke(this.game, this.body.x, this.body.y);

    // Reflect around the horizontal midline horizontal
    const newY = this.game.height - this.body.y;
    this.body.y = Phaser.Math.clamp(newY,
      (this.height / 2), this.game.height - (this.height / 2));
  }

  charge() {
    // Used by paddle with sidekick
  }

  reset() {
    this.health = this.maxHealth;
    this.x = this.config.left ?
      this.posOffset :
      this.game.width - this.posOffset;
    this.y = this.game.height / 2;
  }

  goalImpact() {
    this.flashColor('paddleFlashWhite');
    this.game.time.events.add(Phaser.Timer.SECOND * 0.1, this.clearImpact,
      this);
  }
  blockImpact() {
    this.blocking = true;
    this.flashColor('paddleFlashBlack');
    this.game.time.events.add(Phaser.Timer.SECOND * 0.05, this.clearImpact,
      this);
  }
  clearImpact() {
    this.blocking = false;
    this.unflashColor();
  }

  hit(damage) {
    this.goalImpact();
    this.health -= damage;
    if (this.ai) {
      this.ai.reset();
    }
  }

  goal(damage) {
    this.goalImpact();
    this.health -= damage;
    if (this.ai) {
      this.ai.reset();
    }
  }

  heal(health) {
    this.blockImpact();
    this.health += health;
    if (this.ai) {
      this.ai.reset();
    }
  }

  getHealthPercent() {
    return Phaser.Math.clamp(this.health / this.maxHealth, 0, 1);
  }

  flashColor(colorImage) {
    this.loadTexture(colorImage);
  }

  unflashColor() {
    // Restore the original texture
    this.setTexture(this.originalTexture);
  }
}

export default Paddle;
