function HealthMeter() {

  this.player = null;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupHealthMeter = function(
      image,
      player,
      gameManager) {

    // perform parent class startup
    this.startupRepeatingVisualGameObject(
      image,
      30, // xPos
      30, // yPos
      1, // zOrder
      120, // width -- will be overwritten in update()
      29, // height
      0, // scroll factor
      gameManager
    );

    // do this object's startup
    this.player = player;
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    if (this.player.health > 0) {
      this.width = this.player.health * this.image.width;
    } else {
      this.shutdownHealthMeter();
    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownHealthMeter = function() {
    // perform parent shutdown
    this.shutdownRepeatingVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
HealthMeter.prototype = new RepeatingVisualGameObject; // inheritance
