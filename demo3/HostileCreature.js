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
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    this.xPos += this.velX * dt;
    this.yPos += this.velY * dt;

    if (!this.grounded) {
      // apply gravity
      this.velY = this.velY + this.GRAVITY;
    }

    // Remove the object one you disappear off screen
    if (this.xPos < xScroll - this.frameWidth) {
      this.shutdownHostileCreature();
    }

    // at the very end, set grounded to false.
    // the collider function will set this to true
    // in the collision loop
    this.grounded = false;
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
