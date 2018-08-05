import Phaser from 'phaser';

import Properties from '../Properties';

class Background extends Phaser.Sprite {
  constructor(game, imageKey) {
    super(game, 0, 0, imageKey);

    this.scale.set(Properties.scaleRatio);

    this.x = (game.width - this.width) / 2;

    game.add.existing(this);
  }
}

export default Background;
