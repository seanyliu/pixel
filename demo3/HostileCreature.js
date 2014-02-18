function HostileCreature() {

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupHostileCreature = function(image, xPos, yPos, zOrder, frameStart, frameEnd, frameWidth, frameHeight, collisionWidth, collisionHeight, gameManager) {
    // perform parent class startup
    this.startupCreature(
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
   * Process the collision
   */
  this.collide = function(/** GameObject */ other) {
    var myBox = this.collisionArea();
    var otherBox = other.collisionArea();

    if (other instanceof PlayerCreature) {
      other.updateHealth(-1);
    }

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
  this.shutdownHostileCreature = function() {
    // perform parent shutdown
    this.shutdownCreature();

    // perform self shutdown
    // N/A
  }
}
HostileCreature.prototype = new Creature; // inheritance
