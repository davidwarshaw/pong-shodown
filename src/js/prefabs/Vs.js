import Phaser from 'phaser';

import Properties from '../Properties';

class Vs extends Phaser.Sprite {
  constructor(game, x, y, showKo) {
    super(game, x, y, 'vs', 0);

    this.animations.add('vs', [0], 1, true);
    this.animations.add('ko', [1], 1, true);

    this.scale.set(Properties.scaleRatio);
    this.anchor.setTo(0.5, 0.5);

    if (showKo) {
      this.animations.play('ko');
    }

    game.add.existing(this);
  }

}

export default Vs;
