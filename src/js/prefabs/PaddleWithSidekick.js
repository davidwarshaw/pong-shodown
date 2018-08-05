import Phaser from 'phaser';
import Paddle from './Paddle';

import Properties from '../Properties';

class PaddleWithSidekick extends Paddle {
  constructor(game, mode, config, projectile, ball, ai) {
    super(game, mode, config, projectile, ball, ai);

    this.game = game;
    this.config = config;

    // Sprite
    this.sidekick = new Phaser.Sprite(game,
      this.body.x - 32, this.body.y + 16, config.character.sidekick.sprite);
    this.sidekick.scale.set(Properties.scaleRatio);
    this.sidekick.anchor.setTo(0.5, 0.5);

    this.sidekick.speed = config.character.sidekick.speed;

    // Physics
    game.add.existing(this.sidekick);
    game.physics.enable(this.sidekick, Phaser.Physics.P2JS,
      Properties.debugMode);
    this.sidekick.body.collisionId = 'Paddle';

    this.sidekick.body.kinematic = true;
    this.sidekick.body.collideWorldBounds = true;

    // Use the parent collision group
    this.sidekick.body.setCollisionGroup(this.collisionGroup);

    // Body to sprite pointer is for parent
    this.sidekick.body.spritePointer = this;

  }

  collides(collisionGroupArray) {
    this.body.collides(collisionGroupArray);
    this.sidekick.body.collides(collisionGroupArray);
  }

  moveUpLeft() {
    this.body.y = Phaser.Math.clamp(this.body.y - this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.body.x = Phaser.Math.clamp(this.body.x - this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('up-left');
    this.sidekick.body.y = Phaser.Math.clamp(
      this.sidekick.body.y - this.sidekick.speed,
      (this.sidekick.height / 2),
      this.game.height - (this.sidekick.height / 2));
    this.sidekick.body.x = Phaser.Math.clamp(
      this.sidekick.body.x - this.sidekick.speed,
      this.xMin, this.xMax);
  }
  moveUpRight() {
    this.body.y = Phaser.Math.clamp(this.body.y - this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.body.x = Phaser.Math.clamp(this.body.x + this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('up-right');
    this.sidekick.body.y = Phaser.Math.clamp(
      this.sidekick.body.y - this.sidekick.speed,
      (this.sidekick.height / 2),
      this.game.height - (this.sidekick.height / 2));
    this.sidekick.body.x = Phaser.Math.clamp(
      this.sidekick.body.x + this.sidekick.speed,
      this.xMin, this.xMax);
  }
  moveDownLeft() {
    this.body.y = Phaser.Math.clamp(this.body.y + this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.body.x = Phaser.Math.clamp(this.body.x - this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('down-left');
    this.sidekick.body.y = Phaser.Math.clamp(
      this.sidekick.body.y + this.sidekick.speed,
      (this.sidekick.height / 2),
      this.game.height - (this.sidekick.height / 2));
    this.sidekick.body.x = Phaser.Math.clamp(
      this.sidekick.body.x - this.sidekick.speed,
      this.xMin, this.xMax);
  }
  moveDownRight() {
    this.body.y = Phaser.Math.clamp(this.body.y + this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.body.x = Phaser.Math.clamp(this.body.x + this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('down-right');
    this.sidekick.body.y = Phaser.Math.clamp(
      this.sidekick.body.y + this.sidekick.speed,
      (this.sidekick.height / 2),
      this.game.height - (this.sidekick.height / 2));
    this.sidekick.body.x = Phaser.Math.clamp(
      this.sidekick.body.x + this.sidekick.speed,
      this.xMin, this.xMax);
  }
  moveUp() {
    this.body.y = Phaser.Math.clamp(this.body.y - this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.cb.pushCommand('up');
    this.sidekick.body.y = Phaser.Math.clamp(
      this.sidekick.body.y - this.sidekick.speed,
      (this.sidekick.height / 2),
      this.game.height - (this.sidekick.height / 2));
  }
  moveDown() {
    this.body.y = Phaser.Math.clamp(this.body.y + this.speed,
      (this.height / 2), this.game.height - (this.height / 2));
    this.cb.pushCommand('down');
    this.sidekick.body.y = Phaser.Math.clamp(
      this.sidekick.body.y + this.sidekick.speed,
      (this.sidekick.height / 2),
      this.game.height - (this.sidekick.height / 2));
  }
  moveLeft() {
    this.body.x = Phaser.Math.clamp(this.body.x - this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('left');
    this.sidekick.body.x = Phaser.Math.clamp(
      this.sidekick.body.x - this.sidekick.speed,
      this.xMin, this.xMax);
  }
  moveRight() {
    this.body.x = Phaser.Math.clamp(this.body.x + this.speed,
      this.xMin, this.xMax);
    this.cb.pushCommand('right');
    this.sidekick.body.x = Phaser.Math.clamp(
      this.sidekick.body.x + this.sidekick.speed,
      this.xMin, this.xMax);
  }

  charge(move) {
    const moveXDelta = this.config.left ? move.x : -move.x;
    const advanceTween = this.game.add.tween(this.sidekick.body)
      .to({ x: this.body.x + moveXDelta, y: this.body.y + move.y },
        move.time, Phaser.Easing.Linear.None);
    const retreatTween = this.game.add.tween(this.sidekick.body)
      .to({ x: this.body.x, y: this.body.y },
        move.time, Phaser.Easing.Linear.None);
    advanceTween.chain(retreatTween);
    advanceTween.start();
  }
}

export default PaddleWithSidekick;
