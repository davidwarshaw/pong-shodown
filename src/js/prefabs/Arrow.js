import Phaser from 'phaser';

import Properties from '../Properties';

class Arrow extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'arrowUp', 0);

    this.animations.add('arrow', [0], 1, true);
    this.animations.add('button', [1], 1, true);

    this.scale.set(Properties.scaleRatio);
    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);
  }

}

export default Arrow;
