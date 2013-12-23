function Repellant() {
  this.START_LIFE = 5; // how long the repellant lives
  this.CURRENT_LIFE = 0; // how much longer the repellant has

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupRepellant = function(image, xPos, yPos) {
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
    this.CURRENT_LIFE = this.START_LIFE;
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    this.CURRENT_LIFE -= dt;
    if (this.CURRENT_LIFE < 0) {
      this.shutdownRepellant();
    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownRepellant = function() {
    // perform parent shutdown
    this.shutdownAnimatedVisualGameObject();

    // perform self shutdown
    // N/A
    this.gameManager.removeRepellant(this);
  }
}
Repellant.prototype = new AnimatedVisualGameObject; // inheritance
