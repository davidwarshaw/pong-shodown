import Paddle from './prefabs/Paddle';
import PaddleWithSidekick from './prefabs/PaddleWithSidekick';

class Factory {

  static getPaddle(game, mode, config, projectile, ball, ai) {
    if (config.character.sidekick) {
      return new PaddleWithSidekick(
        game, mode, config, projectile, ball, ai);
    }
    return new Paddle(
      game, mode, config, projectile, ball, ai);
  }
}

export default Factory;
