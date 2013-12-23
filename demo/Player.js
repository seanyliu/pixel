function Player() {
  // speed player moves at
  this.speed = 75;

  // jumping stats
  this.jumpHeight = 64;
  this.halfPI = Math.PI / 2;
  // amount of time to spend in the air
  this.jumpHangTime = 0.5;
  // speed to pregress along the sine wave
  this.jumpSinWaveSpeed = this.halfPI / this.jumpHangTime;
  // current position along the sine wave
  this.jumpSinWavePos = 0;
  // rate to fall at
  this.fallMultiplier = 1.5;
  this.grounded = true;

  // TODO: you shouldn't really be able to have isMovingLeft && isMovingRight
  // this should instead be single a tri-state [left, 0, right] variable.
  this.isMovingLeft = false;
  this.isMovingRight = false;
  this.isMovingUp = false;
  this.isMovingDown = false;
  this.level = null;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupPlayer = function(image, level, gameManager) {
    // perform parent class startup
    this.startupAnimatedVisualGameObject(
      image,
      300, // xPos
      400 - 64 - 120, // yPos
      0, // zOrder
      0, // frameStart
      0, // frameEnd
      //0, // frameStart
      //1, // frameEnd
      120, // frameWidth
      120, // frameHeight
      gameManager
    );
    // TODO: put the level in the game manager instead of player
    this.level = level;
  }

  /**
   * Called when a key is pressed. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyDown = function(event) {
    if (event.keyCode == 37 && !this.isMovingLeft) {
      // left
      this.isMovingLeft = true;
      this.updateAnimation();
    }
    if (event.keyCode == 39 && !this.isMovingRight) {
      // right
      this.isMovingRight = true;
      this.updateAnimation();
    }
    // TODO: change grounded to be opposite so it's consistently !this.isMovingUp
    if (event.keyCode == 38 && this.grounded) {
      this.grounded = false;
      this.jumpSinWavePos = 0;
    }
/**
 * Disable up and down for now
    if (event.keyCode == 38 && !this.isMovingUp) {
      // up
      this.isMovingUp = true;
    }
    if (event.keyCode == 40 && !this.isMovingDown) {
      // down
      this.isMovingDown = true;
    }
*/
  }

  /**
   * Called when a key is released. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyUp = function(event) {
    if (event.keyCode == 37 && this.isMovingLeft) {
      // left
      this.isMovingLeft = false;
      this.updateAnimation(true);
    }
    if (event.keyCode == 39 && this.isMovingRight) {
      // right
      this.isMovingRight = false;
      this.updateAnimation();
    }
    if (event.keyCode == 38 && this.isMovingUp) {
      // up
      this.isMovingUp = false;
    }
    if (event.keyCode == 40 && this.isMovingDown) {
      // down
      this.isMovingDown = false;
    }
  }

  /**
   * updates the animation. You need idleFacingLeft because
   * when you stop moving, we don't know whether to face the character
   * to the left or right, since we have no glimpse into past state.
   * We could probably add a past state...but too lazy for now.
   */
  this.updateAnimation = function(idleFacingLeft) {
    if (this.isMovingRight && this.isMovingLeft) {
      // idle right
      this.setAnimation(0, 0);
    } else if (this.isMovingRight) {
      this.setAnimation(0, 3);
    } else if (this.isMovingLeft) {
      this.setAnimation(4, 7);
    } else {
      // idle
      if (idleFacingLeft) {
        // idle left
        this.setAnimation(7, 7);
      } else {
        // idle right
        this.setAnimation(0, 0);
      }
    }
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    // modify the xScroll value to keep the player on the screen
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

    // Scroll the page
    // TODO: also give a bit more buffer so you don't have to walk to the
    // very edge before it starts to scroll.
    if (this.xPos > 
          (canvasContextHandle.canvas.width - this.frameWidth + xScroll)) {
      gameManager.xScroll = this.xPos - (canvasContextHandle.canvas.width - this.frameWidth);
    }
    if (this.xPos < xScroll) {
      gameManager.xScroll = this.xPos;
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
  this.shutdownPlayer = function() {
    // perform parent shutdown
    this.shutdownAnimatedVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
Player.prototype = new AnimatedVisualGameObject; // inheritance
