import Phaser from 'phaser';

import Properties from '../Properties';

class Petal extends Phaser.Sprite {
  constructor(game, x, y, driftSpeed, fallSpeed, animationFps) {
    super(game, x, y, 'petal', 0);

    this.scale.set(Properties.scaleRatio);
    this.anchor.setTo(0.5, 0.5);

    this.defaultAnimation = this.animations.add('default');
    this.defaultAnimation.play(animationFps, true);

    //this.checkWorldBounds = true;
    //this.outOfBoundsKill = true;

    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.P2JS, Properties.debugMode);
    this.body.collideWorldBounds = false;

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);

    this.body.velocity.x = driftSpeed;
    this.body.velocity.y = fallSpeed;
  }
}

export default Petal;
