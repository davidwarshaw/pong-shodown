import Phaser from 'phaser';

import Properties from '../Properties';

class CharacterSelectFrame extends Phaser.Sprite {
  constructor(game, mode, startingRow, startingColumn, left,
    maxRow, maxColumn, rcToXy, selectCharacter, activateCharacter) {
    super(game, 100, 100, 'characterSelectFrame', 0);

    this.isLeft = left;
    this.maxRow = maxRow;
    this.maxColumn = maxColumn;
    this.rcToXy = rcToXy;
    this.selectCharacter = selectCharacter;
    this.activateCharacter = activateCharacter;

    this.animations.add('p1', [0], 1, true);
    this.animations.add('p2', [1], 1, true);
    this.animations.add('both', [2], 1, true);

    this.scale.set(Properties.scaleRatio);
    this.anchor.setTo(0.5, 0.5);

    game.add.existing(this);

    this.row = startingRow;
    this.column = startingColumn;

    this.isActivated = false;

    // Set the correct character select animation and keys
    if (this.isLeft) {
      // Clone left keys, so we don't mutate them
      const leftKeys = JSON.parse(JSON.stringify(Properties.leftPlayerKeys));

      // If we're not in versus mode, then use main action as the duel action
      if (mode !== Properties.mode.versus) {
        leftKeys.duelAction = leftKeys.action;
      }
      this.keys = game.input.keyboard.addKeys(leftKeys);
      this.mainAnimation = 'p1';
    }
    else {
      this.keys = game.input.keyboard.addKeys(Properties.rightPlayerKeys);
      this.mainAnimation = 'p2';
    }

    this.animations.play(this.mainAnimation);

  }

  update() {
    // Only move if not activated
    if (!this.isActivated) {
      const keyRepeatsPerMove = 10;
      if (this.keys.up.isDown &&
      (this.keys.up.repeats % keyRepeatsPerMove === 0)) {
        this.row = Phaser.Math.clamp(this.row - 1, 0, this.maxRow);
      }
      else if (this.keys.down.isDown &&
      (this.keys.down.repeats % keyRepeatsPerMove === 0)) {
        this.row = Phaser.Math.clamp(this.row + 1, 0, this.maxRow);
      }
      else if (this.keys.left.isDown &&
      (this.keys.left.repeats % keyRepeatsPerMove === 0)) {
        this.column = Phaser.Math.clamp(this.column - 1, 0, this.maxColumn);
      }
      else if (this.keys.right.isDown &&
      (this.keys.right.repeats % keyRepeatsPerMove === 0)) {
        this.column = Phaser.Math.clamp(this.column + 1, 0, this.maxColumn);
      }

      if (this.keys.duelAction.isDown) {
        // Allow activation of the frame to be set by the state
        this.isActivated = this.activateCharacter(this.isLeft,
          this.row, this.column);
      }

      this.moveToRowColumn();
    }
  }

  moveToRowColumn() {
    // If both select frames are on the same tile, change the animation to
    // the both animation
    if (this.opponentSelectFrame &&
      this.row === this.opponentSelectFrame.row &&
      this.column === this.opponentSelectFrame.column) {
      this.animations.play('both');
    }
    else {
      this.animations.play(this.mainAnimation);
    }

    const pos = this.rcToXy(this.row, this.column);
    this.x = pos.x;
    this.y = pos.y;

    // Select this character in the state
    this.selectCharacter(this.isLeft, this.row, this.column);
  }

  registerObjects(opponentSelectFrame) {
    this.opponentSelectFrame = opponentSelectFrame;
  }
}

export default CharacterSelectFrame;
