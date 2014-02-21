function HostileCreature() {

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupHostileCreature = function(image, xPos, yPos, zOrder, frameStart, frameEnd, frameWidth, frameHeight, collisionWidth, collisionHeight, gameManager) {
    // perform parent class startup
    this.startupCreature(
      image,
      xPos,
      yPos,
      zOrder,
      frameStart,
      frameEnd,
      frameWidth,
      frameHeight,
      collisionWidth,
      collisionHeight,
      gameManager
    );
    this.velX = -100;
  }

  /**
   * Process the collision
   */
  this.collide = function(/** GameObject */ other) {
    if (other instanceof PlayerCreature) {
      //other.updateHealth(-1);
    }

    if (other instanceof Ground) {
      this.collideGround(other);
    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownHostileCreature = function() {
    // perform parent shutdown
    this.shutdownCreature();

    // perform self shutdown
    // N/A
  }
}
HostileCreature.prototype = new Creature; // inheritance
