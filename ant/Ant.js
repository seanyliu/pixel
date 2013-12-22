function Ant() {
  // speed ant moves at
  this.speed = 75;

  // TODO: you shouldn't really be able to have isMovingLeft && isMovingRight
  // this should instead be single a tri-state [left, 0, right] variable.
  this.isMovingLeft = false;
  this.isMovingRight = false;
  this.isMovingUp = false;
  this.isMovingDown = false;
  this.level = null;

  this.TOO_CLOSE_THRESHOLD = 100;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupAnt = function(image, xPos, yPos) {
    // perform parent class startup
    this.startupAnimatedVisualGameObject(
      image,
      xPos, // xPos
      yPos, // yPos
      0, // zOrder
      0, // frameStart
      0, // frameEnd
      //0, // frameStart
      //1, // frameEnd
      4, // frameWidth
      4, // frameHeight
      GB_gameManager
    );
  }

  /**
   * Called when a key is pressed. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyDown = function(event) {
    /*
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
    */
  }

  /**
   * Called when a key is released. GameManager cycles
   * through all the objects and invokes keyUp and keyDown.
   */
  this.keyUp = function(event) {
    /*
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
    */
  }

  /**
   * updates the animation. You need idleFacingLeft because
   * when you stop moving, we don't know whether to face the character
   * to the left or right, since we have no glimpse into past state.
   * We could probably add a past state...but too lazy for now.
   */
  this.updateAnimation = function(idleFacingLeft) {
    /*
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
    */
  }

  /**
   * computes the distance between 2 ants
   */
  this.distanceTo = function(otherAnt) {
    var xDist = this.xPos - otherAnt.xPos;
    var yDist = this.yPos - otherAnt.yPos;
    return Math.sqrt(
      Math.pow(xDist, 2) + Math.pow(yDist, 2)
    );
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {

    var isOtherAntTooClose = false;
    var anglesToOtherAnts = new Array();
    for (var i=0; i<GB_ants.length; i++) {
      var otherAnt = GB_ants[i];
      var distance = this.distanceTo(otherAnt);
      if (distance != 0) {
        // distance = 0 is likely to be yourself
        if (distance < this.TOO_CLOSE_THRESHOLD) {
          isOtherAntTooClose = true;
          var yDist = otherAnt.yPos - this.yPos;
          var ratio = yDist/distance;
          var angleToOtherAnt = Math.asin(ratio);
          if (otherAnt.xPos - this.xPos < 0) {
            angleToOtherAnt = Math.PI - angleToOtherAnt;
          }
          anglesToOtherAnts.push(angleToOtherAnt);
        }
      }
    }

    if (isOtherAntTooClose) {
      var xChg = 0;
      var yChg = 0;
      for (var i=0; i<anglesToOtherAnts.length; i++) {
        var angleToOtherAnt = anglesToOtherAnts[i];
        var oppositeAngle = angleToOtherAnt + Math.PI;
        xChg += Math.cos(oppositeAngle) * this.speed * dt;
        yChg += Math.sin(oppositeAngle) * this.speed * dt;
      }
      xChg = xChg / anglesToOtherAnts.length;
      yChg = yChg / anglesToOtherAnts.length;
      if (isNaN(xChg)) {
        debug("NAN");
      }
      this.xPos += xChg;
      this.yPos += yChg;
    } else {
      // move randomly
      var randAngle = Math.random() * Math.PI * 2;
      this.xPos += Math.cos(randAngle) * this.speed * dt;
      this.yPos += Math.sin(randAngle) * this.speed * dt;
    }

    // keep the ant bound to the level
    if (this.xPos > parseInt(canvasContextHandle.canvas.width) - 4) { // TODO: don't hardcore 4, the width of the ant
      this.xPos = parseInt(canvasContextHandle.canvas.width) - 4;
    }
    if (this.xPos < 0) {
      this.xPos = 0;
    }
    if (this.yPos > parseInt(canvasContextHandle.canvas.height) - 4) {
      this.yPos = parseInt(canvasContextHandle.canvas.height) - 4;
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
  this.shutdownAnt = function() {
    // perform parent shutdown
    this.shutdownAnimatedVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
Ant.prototype = new AnimatedVisualGameObject; // inheritance
