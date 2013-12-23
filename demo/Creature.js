function Creature() {
  // speed creature moves at
  this.speed = 30;

  // jumping stats
  this.jumpHeight = 64;
  this.halfPI = Math.PI / 2;
  this.jumpHangTime = 0.5; // amount of time to spend in the air
  this.jumpSinWaveSpeed = this.halfPI / this.jumpHangTime; // speed to pregress along the sine wave
  this.jumpSinWavePos = 0; // current position along the sine wave
  this.fallMultiplier = 1.5; // rate to fall at
  this.grounded = true;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   *
   * Creatures need access to the level to make sure that they
   * can only move to valid places.
   */
  this.startupCreature = function(image, level, gameManager) {
    // perform parent class startup
    this.startupAnimatedVisualGameObject(
      image,
      400, // xPos
      600 - 64 - 120, // yPos
      0, // zOrder
      0, // frameStart
      0, // frameEnd
      120, // frameWidth
      120, // frameHeight
      gameManager
    );
    this.level = level;
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    this.setAnimation(0, 0); // idle right
    this.xPos += this.speed * dt;

    // XOR operation
    // test for collision if the player is moving left or right (and not
    // both at the same time)
    if ((this.isMovingRight || this.isMovingLeft) && !(this.isMovingLeft && this.isMovingRight)) {
      // true if player is colliding
      var collision = false;

      // may have to push player back through several blocks
      do {
        // if running left, test left corner of sprite, otherwise right
        var xPos = this.isMovingLeft ? this.xPos : this.xPos + this.frameWidth;
        var currentBlockIdx = this.level.currentBlock(xPos);
        var groundHeight = this.level.groundHeight(currentBlockIdx);
        var playerHeight = canvasContextHandle.canvas.height - (this.yPos + this.frameHeight);
        if (playerHeight < groundHeight) {
          collision = true;
          if (this.isMovingRight) {
            // we are moving right, so push player left
            this.xPos = this.level.blockWidth * currentBlockIdx - this.frameWidth - 1;
          } else {
            this.xPos = this.level.blockWidth * (currentBlockIdx + 1);
          }
        } else {
          collision = false;
        }
      } while (collision)
    }

    // keep the player bound to the level
    if (this.xPos > this.level.blocks.length * this.level.blockWidth - this.frameWidth - 1) {
      this.xPos = this.level.blocks.length * this.level.blockWidth - this.frameWidth - 1;
    }
    if (this.xPos < 0) {
      this.xPos = 0;
    }

    // if the player is jumping or falling, move along the sine wave
    if (!this.grounded) {
      var lastHeight = this.jumpSinWavePos;
      // the new position on the sine wave
      this.jumpSinWavePos += this.jumpSinWaveSpeed * dt;

      if (this.jumpSinWavePos >= Math.PI) {
        // we have fallen off the bottom of the sine wave, so continue
        // moving at a predetermined speed
        this.yPos += this.jumpHeight / this.jumpHangTime * this.fallMultiplier * dt;
      } else {
        // else move along the sine wave
        this.yPos -= (Math.sin(this.jumpSinWavePos) - Math.sin(lastHeight)) * this.jumpHeight;
      }
    }

    // TODO: make the collision code modular
    // check for collisions to stop the jump
    // left side
    var currentBlock1 = this.level.currentBlock(this.xPos);
    // right side
    var currentBlock2 = this.level.currentBlock(this.xPos + this.frameWidth);
    // ground height below left side
    var groundHeight1 = this.level.groundHeight(currentBlock1);
    // ground height below right side
    var groundHeight2 = this.level.groundHeight(currentBlock2);
    // highest point under player
    var maxGroundHeight = groundHeight1 > groundHeight2 ? groundHeight1 : groundHeight2;
    // players height (relative to bottom of screen)
    // TODO: fix this.image.height in case you have a spriate that is larger than the char's bounding box
    var playerHeight = canvasContextHandle.canvas.height - (this.yPos + this.frameHeight);

    // we hit ground
    if (maxGroundHeight >= playerHeight) {
      // TODO: don't use this.image.height
      this.yPos = canvasContextHandle.canvas.height - maxGroundHeight - this.frameHeight;
      this.grounded = true;
      this.jumpSinWavePos = 0;
    } else if (this.grounded) {
      // we walked off a cliff
      this.grounded = false;
      // start falling down the size wave from the top
      this.jumpSinWavePos = this.halfPI;
    }



/*
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
*/
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownCreature = function() {
    // perform parent shutdown
    this.shutdownAnimatedVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
Creature.prototype = new AnimatedVisualGameObject; // inheritance
