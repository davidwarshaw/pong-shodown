import Phaser from 'phaser';

import Properties from '../Properties';

class Goal {

  constructor(game, config) {
    const goalWidth = 50;
    const xPos = config.left ?
      0 - (goalWidth / 3) :
      game.width + (goalWidth / 3);
    const yPos = game.height / 2;

    this.game = game;
    this.config = config;

    this.body = new Phaser.Physics.P2.Body(game);
    this.body.clearShapes();
    this.body.addRectangle(goalWidth, game.height, xPos, yPos);
    this.body.collisionId = 'Goal';

    this.body.kinematic = true;
    this.body.collideWorldBounds = true;
    this.body.debug = Properties.debugMode;

    game.physics.p2.addBody(this.body);

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);

    // Bind callbacks
    this.goal = this.goal.bind(this);
  }

  registerObjects(opponent, info, ball, owner) {
    this.opponent = opponent;
    this.info = info;
    this.ball = ball;
    this.owner = owner;
  }

  goal(thisBody, colliderBody) {
    // Only score a goal with the ball
    if(colliderBody.collisionId === 'Ball') {
      this.owner.goal(this.opponent.ballDamage);
      const healthPercent = this.owner.getHealthPercent();

      // Set the health bar on the side of the goal
      if (this.config.left) {
        this.info.setLeftHealth(healthPercent);
      }
      else {
        this.info.setRightHealth(healthPercent);
      }

      this.ball.putIntoPlay(false);
    }
  }
}
export default Goal;
