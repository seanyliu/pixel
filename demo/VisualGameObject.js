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
   * TEST FUNCTION
   * TODO: delete
   */
  this.update = function(dt, canvasContextHandle) {
    // TODO: make this not so low level
    var xDelta = Math.round(10 * Math.random() - 5);
    var yDelta = Math.round(10 * Math.random() - 5);
    var xLowLim = 0;
    var yLowLim = 0;
    var xHiLim = 480 - 30;
    var yHiLim = 320 - 30;
    this.xPos = this.xPos + xDelta;
    this.yPos = this.yPos + yDelta;
  
    if (this.yPos < yLowLim)  {
      this.yPos = this.yPos + 2*yDelta;
    } else if (this.yPos > yHiLim)  {
      this.yPos = this.yPos-2*yDelta;
    }

    if (this.xPos<xLowLim)  {
      this.xPos = this.xPos+2*yDelta;
    } else if (this.xPos > xHiLim)  {
      this.xPos = this.xPos-2*yDelta;
    }
  }

  /**
   * Draw from top left corner, shift based on how far user has scrolled on screen
   */
  this.draw = function(dt, canvasContextHandle, xScroll, yScroll) {
    canvasContextHandle.drawImage(this.image, this.xPos - xScroll, this.yPos - yScroll); 
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
