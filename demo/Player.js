function Player() {
  // speed player moves at
  this.speed = 75;
  this.isMovingLeft = false;
  this.isMovingRight = true;
  this.isMovingUp = false;
  this.isMovingDown = false;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupPlayer = function(image) {
    // perform parent class startup
    this.startupAnimatedVisualGameObject(
      image,
      0, // xPos
      0, // yPos
      0, // zOrder
      40, // frameStart
      48, // frameEnd
      64, // frameWidth
      64, // frameHeight
      GB_gameManager
    );
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    if (this.isMovingLeft) {
      this.xPos -= this.speed * dt;
    }
    if (this.isMovingRight) {
      this.xPos += this.speed * dt;
    }
    if (this.isMovingUp) {
      this.yPos -= this.speed * dt;
    }
    if (this.isMovingDown) {
      this.yPos += this.speed * dt;
    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownPlayer = function() {
    // perform parent shutdown
    this.shutdownAnimatedVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
Player.prototype = new AnimatedVisualGameObject; // inheritance
