function Creature() {

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
  this.facingX = -1;

  // stats
  this.health = 100;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupCreature = function(image, xPos, yPos, zOrder, frameStart, frameEnd, frameWidth, frameHeight, collisionWidth, collisionHeight, gameManager) {
    // perform parent class startup
    this.startupAnimatedVisualGameObject(
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

    // at the very end, set grounded to false.
    // the collider function will set this to true
    // in the collision loop
    this.grounded = false;
  }

  /**
   * Update health
   */
  this.updateHealth = function(dhealth) {
    this.health += dhealth;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  /**
   * Process the collision
   */
  this.collide = function(/** GameObject */ other) {
    var myBox = this.collisionArea();
    var otherBox = other.collisionArea();

    if (other instanceof Ground) {

      // first handle the Y position
      // only do this for ground, so enemies can't push you down.
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
          this.xPos -= (myBox.x + myBox.width - otherBox.x);
        }
      } else if (this.velX < 0) {
        // heading left, so check left side
        if (otherBox.x + otherBox.width > myBox.x) {
          this.xPos += (otherBox.x + otherBox.width - myBox.x);
        }
      }
    }
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
