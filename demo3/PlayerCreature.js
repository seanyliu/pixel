function PlayerCreature() {

  // state for fallen down
  // in reality, you could merge isFallen
  // and timeLeftForFall to be a single variable,
  // but we split it for readability
  this.isFallen = false;
  this.FALL_DURATION_FRAMES = 5;
  this.fallDuration = 0;
  this.timeLeftForFall = 0;

  this.keyUpIsPressed = false;
  this.maxJumpVelAchieved = false;

  this.runSpeed = 200;

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
      130, // frameWidth
      130, // frameHeight
      80, // collisionWidth
      130, // collisionHeight
      gameManager
    );
    this.fallDuration = 1/gameManager.FPS * this.FALL_DURATION_FRAMES;
    this.velX = this.runSpeed;
    this.velY = 0;
    this.updateAnimation();
    this.health = 3;
  }

  /**
   * Called when a key is pressed. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyDown = function(event) {
/*
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
*/
    if ((event.keyCode == 38 || event.keyCode == 32) && this.grounded) {
      // up

      // simple, fixed jump:
      //this.velY = this.VELOCITY_JUMP;

      // instead, make the user jump higher if they hold the jump key
      this.keyUpIsPressed = true;
      this.maxJumpVelAchieved = false;
    }
  }

  /**
   * Called when a key is released. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyUp = function(event) {
/*
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
*/
    if (event.keyCode == 38 || event.keyCode == 32) {
      // up
      this.keyUpIsPressed = false;
    }
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {

    // Make the user jump higher if they keep holding the up key
    if (this.keyUpIsPressed && !this.isFallen && !this.maxJumpVelAchieved) {
      this.velY += this.VELOCITY_JUMP_INCREMENT;
    }

    // But cap just how high the user can jump
    if (this.velY < this.VELOCITY_JUMP_MAX) {
      this.maxJumpVelAchieved = true;
    }

    if (this.isFallen) {
      this.timeLeftForFall -= dt;
      if (this.timeLeftForFall <= 0) {
        this.timeLeftForFall = 0;
        this.velX = this.runSpeed;
        this.isFallen = false;
        this.updateAnimation();
      }
    }

    // check for game over conditions
    if (this.health <= 0) {
      this.gameManager.gameOver();
    }
    if (this.yPos > canvasContextHandle.canvas.height) {
      this.gameManager.gameOver();
    }

    this.xPos += this.velX * dt;
    this.yPos += this.velY * dt;

    if (!this.grounded) {
      // apply gravity
      this.velY = this.velY + this.GRAVITY;
    }

    // Scroll the page
    this.gameManager.xScroll = this.xPos - canvasContextHandle.canvas.width/2 + this.frameWidth/2;

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

    if (other instanceof HostileCreature) {
      if (!this.isFallen) {
        this.health = this.health - 1;
      }
      this.isFallen = true;
      this.timeLeftForFall = this.fallDuration;
      this.setAnimation(4,4);
      this.velX = 0;
    }
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
