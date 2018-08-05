import Phaser from 'phaser';

import Properties from '../Properties';

class Ref extends Phaser.Sprite {
  constructor(game) {
    super(game, game.width / 2, game.height / 2, 'blackPaddle');

    this.anchor.setTo(0.5, 0.5);
    this.scale.set(Properties.scaleRatio);

    this.moveDuration = 1500;
    this.pauseDuration = 500;

    this.approachedY = game.height / 2;
    this.approachedScaleRatio = Properties.scaleRatio;

    this.recededY = game.height * (3 / 4);
    this.recededScaleRatio = 2.00;

    game.add.existing(this);
  }

  recedeTween() {
    const scale = this.game.add.tween(this.scale)
      .to({ x: this.recededScaleRatio, y: this.recededScaleRatio },
        this.moveDuration, Phaser.Easing.Linear.None);
    const y = this.game.add.tween(this)
      .to({ y: this.recededY },
        this.moveDuration, Phaser.Easing.Linear.None);
    return { scale, y };
  }

  approachTween() {
    const scale = this.game.add.tween(this.scale)
      .to({ x: this.approachedScaleRatio, y: this.approachedScaleRatio },
        this.moveDuration, Phaser.Easing.Linear.None);
    const y = this.game.add.tween(this)
      .to({ y: this.approachedY },
        this.moveDuration, Phaser.Easing.Linear.None);
    return { scale, y };
  }

  recede() {
    const tween = this.recedeTween();
    tween.scale.start();
    tween.y.start();
  }

  approach() {
    const tween = this.approachTween();
    tween.scale.start();
    tween.y.start();
  }

  approachThenRecede(cb, left) {
    const approachTween = this.approachTween();
    const recedeTween = this.recedeTween();
    approachTween.scale.onComplete.add(cb, this, 0, left);
    approachTween.scale.chain(recedeTween.scale);
    approachTween.y.chain(recedeTween.y);
    approachTween.scale.start();
    approachTween.y.start();
  }
}

export default Ref;
