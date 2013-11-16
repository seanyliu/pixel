function Player() {
  // speed player moves at
  this.speed = 75;

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
  this.startupPlayer = function(image, level) {
    // perform parent class startup
    this.startupAnimatedVisualGameObject(
      image,
      300, // xPos
      400 - 64 - 48, // yPos
      0, // zOrder
      75, // frameStart
      80, // frameEnd
      //0, // frameStart
      //1, // frameEnd
      64, // frameWidth
      64, // frameHeight
      GB_gameManager
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
      this.setAnimation(75, 80);
    } else if (this.isMovingRight) {
      this.setAnimation(90, 98);
    } else if (this.isMovingLeft) {
      this.setAnimation(40, 48);
    } else {
      // idle
      if (idleFacingLeft) {
        // idle left
        this.setAnimation(25, 30);
      } else {
        // idle right
        this.setAnimation(75, 80);
      }
    }
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    // TODO: make the access to GB_gameManager not be global
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
      GB_gameManager.xScroll = this.xPos - (canvasContextHandle.canvas.width - this.frameWidth);
    }
    if (this.xPos < xScroll) {
      GB_gameManager.xScroll = this.xPos;
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
