function Player() {
  // TODO: make this an inheritable class

  // velocities
  this.velX = 0; // current
  this.velY = 0; // current
  this.GRAVITY = 31;
  this.VELOCITY_JUMP = -210;
  this.VELOCITY_X = 125;
  this.grounded = true;

  // whether to include this in the
  // collision detection
  this.BOX_COLLIDER = true;

  // 1 / -1 = facing right / facing left
  this.facingX = 1;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupPlayer = function(image, gameManager) {
    // perform parent class startup
    this.startupAnimatedVisualGameObject(
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
   * updates the animation. You need idleFacingLeft because
   * when you stop moving, we don't know whether to face the character
   * to the left or right, since we have no glimpse into past state.
   * We could probably add a past state...but too lazy for now.
   */
  this.updateAnimation = function(idleFacingLeft) {
    if (this.velX > 0) {
      this.setAnimation(0, 3);
    } else if (this.velX < 0) {
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
   * Process the collision
   */
  this.collide = function(/** GameObject */ other) {
    var myBox = this.collisionArea();
    var otherBox = other.collisionArea();

    if (other instanceof Ground) {

      // first handle the Y position
      if (this.velY > 0) {
        if (myBox.y + myBox.height > otherBox.y) {
          // There's a Y intersect.
          // Player is falling.  If the intersection is in the lower half of
          // the player, we'll assume they came from above.
          if (myBox.y + myBox.height/2 < otherBox.y) {
            this.yPos -= (myBox.y + myBox.height - otherBox.y);
            this.velY = 0;
            this.grounded = true;
          }
          // If it's in the upper
          // half of the player we'll assume that they may have been jumping,
          // hit the peak of the jump, started falling, and then collided.
        }
      } else if (this.velY < 0) {
        // don't include zero, even though we miss the peak of the jump,
        // because if you're just running on ground, velY = 0;
        if (otherBox.y + otherBox.height > myBox.y) {
          // rising, so came from below, assuming the intersection is in the upper half of the player
          if (myBox.y + myBox.height/2 > otherBox.y) {
            this.yPos += otherBox.y + otherBox.height - myBox.y + 1;
            this.velY = 0;
          }
        }
      } else {
        // if we don't have this, then the grounded check doesn't
        // always seem to trigger because sometimes it catches at 0 velocity
        // when it collides
        this.grounded = true;
      }

      // update the collision area
      myBox = this.collisionArea();

      // check if we still have collision difficulties (e.g. your'e running
      // sideways into a block). If so, handle X collisions.
      if (this.gameManager.intersectsStrictly(myBox, otherBox)) {
        // now handle the X position
        if (this.velX > 0) {
          // heading right, so check right side
          if (myBox.x + myBox.width > otherBox.x) {
            this.xPos -= (myBox.x + myBox.width - otherBox.x + 1);
          }
        } else if (this.velX < 0) {
          // heading left, so check left side
          if (otherBox.x + otherBox.width > myBox.x) {
            this.xPos += (otherBox.x + otherBox.width - myBox.x + 1);
          }
        }
      }
    }
  }

  /**
   * Updates the object
   */
  this.update2 = function(dt, canvasContextHandle, xScroll, yScroll) {
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
      this.gameManager.xScroll = this.xPos - (canvasContextHandle.canvas.width - this.frameWidth);
    }
    if (this.xPos < xScroll) {
      this.gameManager.xScroll = this.xPos;
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
