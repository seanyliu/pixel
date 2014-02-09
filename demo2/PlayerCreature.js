function PlayerCreature() {

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupPlayerCreature = function(image, gameManager) {
    // perform parent class startup
    this.startupCreature(
      image,
      300, // xPos
      400 - 64 - 120, // yPos
      0, // zOrder
      0, // frameStart
      0, // frameEnd
      120, // frameWidth
      120, // frameHeight
      45, // collisionWidth
      100, // collisionHeight
      gameManager
    );

    this.velX = 0;
    this.velY = 0;
  }

  /**
   * Called when a key is pressed. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyDown = function(event) {
    if (event.keyCode == 37 && this.velX >= 0) {
      // left
      this.facingX = -1;
      this.velX = -1 * this.VELOCITY_X;
      this.updateAnimation();
    }
    if (event.keyCode == 39 && this.velX <= 0) {
      // right
      this.facingX = 1;
      this.velX = this.VELOCITY_X;
      this.updateAnimation();
    }
    if (event.keyCode == 38 && this.grounded) {
      // up
      this.velY = this.VELOCITY_JUMP;
    }
  }

  /**
   * Called when a key is released. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyUp = function(event) {
    if (event.keyCode == 37 && this.velX != 0) {
      // left
      this.velX = 0;
      this.updateAnimation(true);
    }
    if (event.keyCode == 39 && this.velX != 0) {
      // right
      this.velX = 0;
      this.updateAnimation();
    }
    if (event.keyCode == 38) {
      // up
    }
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    debug("  Health: "+this.health);
    this.xPos += this.velX * dt;
    this.yPos += this.velY * dt;

    if (!this.grounded) {
      // apply gravity
      this.velY = this.velY + this.GRAVITY;
    }

    // Scroll the page
    this.gameManager.xScroll = this.xPos - canvasContextHandle.canvas.width/2 + this.frameWidth/2;
    if (this.xPos > 
          (canvasContextHandle.canvas.width - this.frameWidth + xScroll)) {
      this.gameManager.xScroll = this.xPos - (canvasContextHandle.canvas.width - this.frameWidth);
    }
    if (this.xPos < xScroll) {
      this.gameManager.xScroll = this.xPos;
    }

    // at the very end, set grounded to false.
    // the collider function will set this to true
    // in the collision loop
    this.grounded = false;
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownPlayerCreature = function() {
    // perform parent shutdown
    this.shutdownCreature();

    // perform self shutdown
    // N/A
  }
}
PlayerCreature.prototype = new Creature; // inheritance
