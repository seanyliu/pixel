function Creature() {
  // speed creature moves at
  this.speed = 30;
  this.horizontalDirection = 0; // -1, 0, 1 for left, still, right
  this.verticalDirection = 0; // -1, 0, 1 for down, still, up

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
      Math.random() * gameManager.mainCanvas.width, // xPos
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
    this.level = level;
  }

  /**
   * make sure the creature cannot move through
   * blocks, etc.
   */
  this.constrainToLevel = function(canvasContextHandle) {
    // xPosition to test for collision. Sometimes top left, sometimes top right
    var xTest = 0;

    // constrain vertical movement
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
    var playerHeight = canvasContextHandle.canvas.height - (this.yPos + this.frameHeight);

    // we hit ground
    if (maxGroundHeight >= playerHeight) {
      this.yPos = canvasContextHandle.canvas.height - maxGroundHeight - this.frameHeight;
      this.grounded = true;
      this.jumpSinWavePos = 0;
    } else if (this.grounded) {
      // we walked off a cliff
      this.grounded = false;
      // start falling down the size wave from the top
      this.jumpSinWavePos = this.halfPI;
    }

    // contrain horizontal movement
    // do this AFTER fixing the vertical piece, because otherwise you may "fall" into the ground
    // i.e. from the falling * dt (if dt is huge), and then be in a collision permanently, and freeze
    // the game
    if (this.horizontalDirection != 0) {
      // may have to push player back through several blocks
      var collision = false;
      do {
        
        // if running left, test left corner of sprite, otherwise right
        xTest = this.xPos;
        if (this.horizontalDirection > 0) xTest = this.xPos + this.frameWidth;

        // get the ground height of the block at the given corner
        var currentBlockIdx = this.level.currentBlock(xTest);
        var groundHeight = this.level.groundHeight(currentBlockIdx);

        // get the creature's height
        var playerHeight = canvasContextHandle.canvas.height - (this.yPos + this.frameHeight);

        // check if the creature intersecting the block
        if (playerHeight < groundHeight) {
          collision = true;
          if (this.horizontalDirection > 0) {
            // we are moving right, so push player left
            this.xPos -= xTest - (this.level.blockWidth * currentBlockIdx) - 1;
          } else {
            this.xPos += this.level.blockWidth * (currentBlockIdx + 1) - this.xPos + 1;
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
  }

  this.randDirection = Math.random(); // TODO: remove this

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {

    if (this.randDirection > 0.5) {
      this.setAnimation(0, 0); // idle right
      this.horizontalDirection = 1;
      this.xPos += this.speed * dt;
    } else {
      this.setAnimation(7, 7); // idle right
      this.horizontalDirection = -1;
      this.xPos -= this.speed * dt;
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

    // this must got AFTER all movement updates
    this.constrainToLevel(canvasContextHandle);

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
