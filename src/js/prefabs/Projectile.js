import Phaser from 'phaser';

import Properties from '../Properties';

class Projectile extends Phaser.Sprite {
  constructor(game, left, config) {
    super(game, -100, -100, config.sprite);
    this.game = game;
    this.isLeft = left;
    this.config = config;

    // Animation
    this.defaultAnimation = this.animations.add('default');

    // Play animations at 15fps and loop
    //this.animations.play('default', config.animationFps, true);
    this.defaultAnimation.play(config.animationFps, true);

    // Stats to keep track of for scoring
    this.numberOfHits = 0;

    this.isFired = false;

    // Impact constants
    this.impactSeconds = 0.10;
    this.impactTint = 0x999999;

    this.scale.set(Properties.scaleRatio);

    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.P2JS, Properties.debugMode);
    this.body.collisionId = 'Projectile';

    this.checkWorldBounds = true;
    this.body.collideWorldBounds = config.collideWorldBounds;
    this.body.damping = 0.0;
    this.body.angularDamping = 0.0;

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);

    // Bind callbacks
    this.hit = this.hit.bind(this);
    this.impact = this.impact.bind(this);

    // Register event callbacks
    this.events.onOutOfBounds.add(this.removeFromPlay, this);

    this.removeFromPlay();
  }

  registerObjects(opponent, info, bomb, onigiri, smoke) {
    this.opponent = opponent;
    this.info = info;
    this.bomb = bomb;
    this.onigiri = onigiri;
    this.smoke = smoke;
  }

  fire(x, y, move) {

    // Set the fired state to true
    this.isFired = true;

    this.body.x = x;
    this.body.y = y;

    this.body.static = false;
    this.defaultAnimation.restart();

    // Reset tint
    this.tint = 0xffffff;
    this.visible = true;

    // Give the projectile rotation or set the angle
    // appropriate to the direction of travel
    if (this.config.rotate) {
      this.body.rotateRight(this.config.rotationSpeed);
    }

    // Move specific rotation angle can override rotation angle
    const rotation = move.rotation || this.config.rotation || 0;
    this.body.rotation = this.isLeft ?
      rotation :
      Phaser.Math.reverseAngle(rotation);

    // Move specific speed can override base speed
    const speed = move.speed || this.config.speed || 0;
    const sign = this.isLeft ? 1 : -1;
    this.body.velocity.x = Math.cos(rotation) * speed * sign;
    this.body.velocity.y = Math.sin(rotation) * speed;
  }

  freeze() {
    this.body.static = true;
    this.body.setZeroVelocity();
    this.body.setZeroRotation();
  }

  removeFromPlay() {

    this.visible = false;
    this.body.static = true;

    this.body.x = -100;
    this.body.y = -100;

    this.body.rotation = this.isLeft ? 0 : Math.PI;

    this.body.setZeroVelocity();
    this.body.setZeroRotation();

    this.isFired = false;
  }

  hit(thisBody, colliderBody) {
    if (colliderBody.collisionId === 'Paddle') {
      if (this.config.damagesOpponent) {
        // Increment the hit count
        this.numberOfHits++;
        this.opponent.hit(this.config.opponentDamage);
        this.updateOpponentHealth();
      }
    }
    else if (colliderBody.collisionId === 'Goal') {
      if (this.config.damagesGoal) {
        // Increment the hit count
        this.numberOfHits++;
        this.opponent.goal(this.config.goalDamage);
        this.updateOpponentHealth();
      }
    }
    else if (colliderBody.collisionId === 'Bomb') {
      // Projectiles that damage opponent can destroy the bomb
      if (this.config.damagesOpponent) {
        // Increment the hit count
        this.numberOfHits++;
        this.bomb.removeFromPlay();
      }
    }
    else if (colliderBody.collisionId === 'Onigiri') {
      // Projectiles that damage the goal can destroy the onigiri
      if (this.config.damagesGoal) {
        // Increment the hit count
        this.numberOfHits++;
        this.onigiri.removeFromPlay();
      }
    }

    // Always kill the projectile
    this.impact();
  }

  impact() {
    this.tint = this.impactTint;
    this.game.time.events.add(Phaser.Timer.SECOND * this.impactSeconds,
      this.removeFromPlay,
      this);
    this.freeze();
  }

  updateOpponentHealth() {
    const healthPercent = this.opponent.getHealthPercent();
    if (this.isLeft) {
      this.info.setRightHealth(healthPercent);
    }
    else {
      this.info.setLeftHealth(healthPercent);
    }
  }
}

export default Projectile;
