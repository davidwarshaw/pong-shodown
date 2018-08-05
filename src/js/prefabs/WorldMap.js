import Phaser from 'phaser';

import Properties from '../Properties';

class WorldMap extends Phaser.TileSprite {
  constructor(game) {
    super(game, 0, 0, 400, 200, 'worldMap');

    this.scale.set(Properties.scaleRatio);

    //this.x = (game.width - this.width) / 2;

    game.add.existing(this);
  }
}

export default WorldMap;
