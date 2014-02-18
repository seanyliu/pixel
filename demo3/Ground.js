function Ground() {
  // whether to include this in the
  // collision detection
  this.BOX_COLLIDER = true;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupGround = function(image, xPos, yPos, zOrder, width, height, gameManager) {
    // perform parent class startup
    this.startupDimensionedVisualGameObject(
      image,
      xPos,
      yPos,
      zOrder, // zOrder
      width, // width
      height, // height
      gameManager
    );
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    // TODO: kill the object if it moves off screen
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownGround = function() {
    // perform parent shutdown
    this.shutdownDimensionedVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
Ground.prototype = new DimensionedVisualGameObject; // inheritance
