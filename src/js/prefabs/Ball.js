import Phaser from 'phaser';

import Properties from '../Properties';

class Ball extends Phaser.Sprite {
  constructor(game) {
    super(game, game.width / 2, game.height / 2, 'ball');
    this.game = game;

    this.objectType = 'Ball';

    this.speed = 550;

    this.scale.set(Properties.scaleRatio);

    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.P2JS, Properties.debugMode);
    this.body.collisionId = 'Ball';
    this.body.setCircle(8 * Properties.scaleRatio);
    this.body.collideWorldBounds = true;
    this.body.damping = 0.0;
    this.body.angularDamping = 0.0;

    this.hitMomentum = 1.02;
    this.blockMomentum = 1.10;
    this.spinFactor = 10.0;

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);

    // Bind callbacks
    this.removeFromPlay = this.removeFromPlay.bind(this);
    this.putIntoPlay = this.putIntoPlay.bind(this);
    this.hit = this.hit.bind(this);
  }

  update() {
  }

  removeFromPlay() {
    this.visible = false;
    this.body.static = true;

    this.body.x = -100;
    this.body.y = -100;

    this.body.setZeroVelocity();
    this.body.setZeroRotation();
  }

  putIntoPlay(left) {
    this.body.static = false;
    this.visible = true;

    this.body.x = this.game.width / 2;
    this.body.y = this.game.height / 2;

    this.body.setZeroVelocity();
    this.body.rotateRight(Properties.random.between(-this.speed, this.speed));

    this.body.velocity.x = left ? -this.speed : this.speed;
  }

  hit(thisBody, colliderBody) {
    if (colliderBody.collisionId === 'Paddle') {

      // When the ball hits a paddle, add some momentum
      const momentum = colliderBody.spritePointer.blocking ?
        this.blockMomentum : this.hitMomentum;
      thisBody.velocity.x = thisBody.velocity.x * momentum;
      thisBody.velocity.y = thisBody.velocity.y * momentum;

      // If the paddle has some y velocity, add some spin
      thisBody.velocity.y = thisBody.velocity.y +
        (this.spinFactor * colliderBody.spritePointer.yVelocity);
    }
  }
}

export default Ball;
