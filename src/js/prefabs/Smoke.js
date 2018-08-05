import Phaser from 'phaser';

import Properties from '../Properties';

class Smoke extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'smoke');
    this.game = game;

    this.inPlay = false;

    // Animation
    this.defaultAnimation = this.animations.add('default');

    // Don't loop, kill on complete
    this.defaultAnimation.play(20, false, true);

    this.scale.set(Properties.scaleRatio);
    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);
  }

}

export default Smoke;
