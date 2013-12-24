function Ant() {
  // speed ant moves at
  this.speed = 70;

  // used for the snake movement for smooth movement
  this.lastAngleMoved = 0;

  // ID - must be an integer!
  this.ID = 0; // the smaller the number, the more "senior" the ant. Smallest # = leader

  this.ANT_TOO_CLOSE_THRESHOLD = 75;
  this.REPELLANT_TOO_CLOSE_THRESHOLD = 125;
  this.REPELLANT_WEIGHT = 2; // how much to weighted average the repellant effect

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupAnt = function(/** integer >= 0 */ID, image, xPos, yPos) {
    // perform parent class startup
    this.startupAnimatedVisualGameObject(
      image,
      xPos, // xPos
      yPos, // yPos
      0, // zOrder
      0, // frameStart
      0, // frameEnd
      4, // frameWidth
      4, // frameHeight
      GB_gameManager
    );
    this.ID = ID;
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
   * Regular mode movement
   */
  this.regularMove = function(dt, canvasContextHandle, xScroll, yScroll) {
    // detect if you're too close to any repellants
    // and compute their angles
    var isRepellantTooClose = false;
    var anglesToRepellants = new Array();
    for (var i=0; i<this.gameManager.repellants.length; i++) {
      var repellant = this.gameManager.repellants[i];
      var distance = this.distanceTo(repellant);
      if (distance < this.REPELLANT_TOO_CLOSE_THRESHOLD) {
        isRepellantTooClose = true;
        var yDist = repellant.yPos - this.yPos;
        var ratio = yDist/distance;
        var angleToRepellant = Math.asin(ratio);
        if (repellant.xPos - this.xPos < 0) {
          angleToRepellant = Math.PI - angleToRepellant;
        }
        anglesToRepellants.push(angleToRepellant);
      }
    }

    // detect if you're too close to any other ants
    // and compute their angles
    var isOtherAntTooClose = false;
    var anglesToOtherAnts = new Array();
    for (var i=0; i<this.gameManager.ants.length; i++) {
      var otherAnt = this.gameManager.ants[i];
      var distance = this.distanceTo(otherAnt);
      if (distance != 0) {
        // distance = 0 is likely to be yourself
        if (distance < this.ANT_TOO_CLOSE_THRESHOLD) {
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

    if (isRepellantTooClose || isOtherAntTooClose) {
      var xChg = 0;
      var yChg = 0;

      // move away from repellants
      for (var i=0; i<anglesToRepellants.length; i++) {
        var angleToRepellant = anglesToRepellants[i];
        var oppositeAngle = angleToRepellant + Math.PI;
        xChg += Math.cos(oppositeAngle) * this.speed * dt * this.REPELLANT_WEIGHT;
        yChg += Math.sin(oppositeAngle) * this.speed * dt * this.REPELLANT_WEIGHT;
      }

      // move away from other ants
      for (var i=0; i<anglesToOtherAnts.length; i++) {
        var angleToOtherAnt = anglesToOtherAnts[i];
        var oppositeAngle = angleToOtherAnt + Math.PI;
        xChg += Math.cos(oppositeAngle) * this.speed * dt;
        yChg += Math.sin(oppositeAngle) * this.speed * dt;
      }

      // average out the movements
      xChg = xChg / (anglesToOtherAnts.length + anglesToRepellants.length * this.REPELLANT_WEIGHT);
      yChg = yChg / (anglesToOtherAnts.length + anglesToRepellants.length * this.REPELLANT_WEIGHT);

      // perform the movement
      this.xPos += xChg;
      this.yPos += yChg;
    } else {
      // move randomly
      var randAngle = Math.random() * Math.PI * 2;
      this.xPos += Math.cos(randAngle) * this.speed * dt;
      this.yPos += Math.sin(randAngle) * this.speed * dt;
    }
  }

  /**
   * create a snake formation
   */
  this.snakeMove = function(dt, canvasContextHandle, xScroll, yScroll) {

    var parentAnt = null;

    // find the ant who's ID is < yours, but is the largest.
    // e.g. if the ID's are: 0, 1, 3, 7, 8, and you are ant 7, then
    // 3 is your parent!
    for (var i=0; i<this.gameManager.ants.length; i++) {
      var otherAnt = this.gameManager.ants[i];
      if (otherAnt.ID < this.ID) {
        if (parentAnt == null || (otherAnt.ID > parentAnt.ID)) {
          parentAnt = otherAnt;
        }
      }
    }

    if (parentAnt == null) {
      // you are the parent!
      // move randomly
      // TODO: fix
      var addOrSubtract = Math.random() > 0.5 ? 1 : -1;
      var randAngleChg = Math.random() * Math.PI * 0.2 * addOrSubtract;
      this.lastAngleMoved = this.lastAngleMoved + randAngleChg;
      this.xPos += Math.cos(this.lastAngleMoved) * this.speed * dt;
      this.yPos += Math.sin(this.lastAngleMoved) * this.speed * dt;
    } else {
      // move toward your parent
      var distance = this.distanceTo(parentAnt);
      if (distance >= this.speed * 0.5) {
        var yDist = parentAnt.yPos - this.yPos;
        var ratio = yDist/distance;
        var angleToOtherAnt = Math.asin(ratio);
        if (parentAnt.xPos - this.xPos < 0) {
          angleToOtherAnt = Math.PI - angleToOtherAnt;
        }
        this.xPos += Math.cos(angleToOtherAnt) * this.speed * dt;
        this.yPos += Math.sin(angleToOtherAnt) * this.speed * dt;
      }
    }

  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {

    if (this.gameManager.gameMode == 0) {
      this.regularMove(dt, canvasContextHandle, xScroll, yScroll);
    } else if (this.gameManager.gameMode == 1) {
      this.snakeMove(dt, canvasContextHandle, xScroll, yScroll);
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
