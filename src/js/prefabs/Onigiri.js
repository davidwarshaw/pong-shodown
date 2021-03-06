import Phaser from 'phaser';

import Properties from '../Properties';

class Onigiri extends Phaser.Sprite {
  constructor(game) {
    super(game, game.width / 2, game.height / 2, 'onigiri');
    this.game = game;

    this.objectType = 'Onigiri';

    this.speed = 550;

    this.healthBonus = 20;

    this.inPlay = false;

    // Impact constants
    this.impactSeconds = 0.05;
    this.impactTint = 0xeeeeee;

    this.scale.set(Properties.scaleRatio);

    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.P2JS, Properties.debugMode);
    this.body.collisionId = 'Onigiri';
    this.body.setCircle(8 * Properties.scaleRatio);
    this.body.collideWorldBounds = true;
    this.body.damping = 0.0;
    this.body.angularDamping = 0.0;

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);

    // Bind callbacks
    this.removeFromPlay = this.removeFromPlay.bind(this);
    this.putIntoPlay = this.putIntoPlay.bind(this);
    this.hit = this.hit.bind(this);
    this.impact = this.impact.bind(this);
  }

  registerObjects(info) {
    this.info = info;
  }

  freeze() {
    this.body.static = true;
    this.body.setZeroVelocity();
    this.body.setZeroRotation();
  }

  removeFromPlay() {
    this.inPlay = false;

    this.visible = false;
    this.body.static = true;

    this.body.x = -100;
    this.body.y = -100;

    this.body.setZeroVelocity();
    this.body.setZeroRotation();
  }

  putIntoPlay(target, tween, left) {
    this.inPlay = true;

    this.body.static = false;
    this.visible = true;

    this.body.x = this.game.width / 2;
    this.body.y = this.game.height / 2;

    this.body.setZeroVelocity();
    const rotationFactor = this.speed * 0.10;
    this.body.rotateLeft(
      Properties.random.between(-rotationFactor, rotationFactor));

    this.body.velocity.x = left ? -this.speed : this.speed;
  }

  hit(thisBody, colliderBody) {
    if (colliderBody.collisionId === 'Paddle') {

      // Onigiri heals the paddle it hits
      colliderBody.spritePointer.heal(this.healthBonus);

      // Update the correct health bar
      const healthPercent = colliderBody.spritePointer.getHealthPercent();
      if (colliderBody.spritePointer.config.left) {
        this.info.setLeftHealth(healthPercent);
      }
      else {
        this.info.setRightHealth(healthPercent);
      }

      // Always kill the projectile
      this.impact();
    }
  }

  impact() {
    this.freeze();
    this.tint = this.impactTint;
    this.game.time.events.add(Phaser.Timer.SECOND * this.impactSeconds,
      this.removeFromPlay,
      this);
  }

}

export default Onigiri;
