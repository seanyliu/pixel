function VisualGameObject() {
  this.image = null;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupVisualGameObject = function(
      image,
      xPos,
      yPos,
      zOrder,
      gameManager) {

    // perform parent class startup
    this.startupGameObject(xPos, yPos, zOrder, gameManager);

    // do this object's startup
    this.image = image;
  }

  /**
   * Draw from top left corner, shift based on how far user has scrolled on screen
   */
  this.draw = function(dt, canvasContextHandle, xScroll, yScroll) {
    canvasContextHandle.drawImage(this.image, this.xPos - xScroll, this.yPos - yScroll); 
  }

  /**
   * Returns a rectangle for collision detection
   */
  this.collisionArea = function() {
    // TODO: instead of constantly creating a new rectangle, we should
    // have just one.
    var rect = new Rectangle();
    rect.startupRectangle(this.xPos, this.yPos, this.image.width, this.image.height, this.gameManager);
    return rect;
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownVisualGameObject = function() {
    // perform parent shutdown
    this.shutdownGameObject();

    // perform self shutdown
    // N/A
  }
}
VisualGameObject.prototype = new GameObject; // inheritance
