import Phaser from 'phaser';

import Properties from '../Properties';

class Win extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'win', 0);

    this.scale.set(Properties.scaleRatio);
    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);
  }

}

export default Win;
