function Player() {
  // speed player moves at
  this.speed = 75;
  this.isMovingLeft = false;
  this.isMovingRight = false;
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
   * Called when a key is pressed. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyDown = function(event) {
    debug("inner keyDown");
    if (event.keyCode == 37) {
      // left
      this.isMovingLeft = true;
    }
    if (event.keyCode == 39) {
      // right
      this.isMovingRight = true;
    }
    if (event.keyCode == 38) {
      // up
      this.isMovingUp = true;
    }
    if (event.keyCode == 40) {
      // down
      this.isMovingDown = true;
    }
  }

  /**
   * Called when a key is released. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyUp = function(event) {
    if (event.keyCode == 37) {
      // left
      this.isMovingLeft = false;
    }
    if (event.keyCode == 39) {
      // right
      this.isMovingRight = false;
    }
    if (event.keyCode == 38) {
      // up
      this.isMovingUp = false;
    }
    if (event.keyCode == 40) {
      // down
      this.isMovingDown = false;
    }
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

    // ensure the player doesn't move out of bounds
    if (this.xPos > canvasContextHandle.canvas.width - this.frameWidth) {
      this.xPos = canvasContextHandle.canvas.width - this.frameWidth;
    }
    if (this.xPos < 0) {
      this.xPos = 0;
    }
    if (this.yPos > canvasContextHandle.canvas.height - this.frameHeight) {
      this.yPos = canvasContextHandle.canvas.height - this.frameHeight;
    }
    if (this.yPos < 0) {
      this.yPos = 0;
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
