function DimensionedVisualGameObject() {
  // final image dimensions
  this.width = 0;
  this.height = 0;
  // how much of the scrollX and scrollY to apply when drawing
  this.scrollFactor = 1;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupDimensionedVisualGameObject = function(
      image,
      xPos,
      yPos,
      zOrder,
      width,
      height,
      gameManager) {

    // perform parent class startup
    this.startupVisualGameObject(image, xPos, yPos, zOrder, gameManager);

    // do this object's startup
    this.width = width;
    this.height = height;
  }

  /**
   * Draw from top left corner, shift based on how far user has scrolled on screen.
   * Repeats the image to fill the dimensions.
   */
  this.draw = function(dt, canvasContextHandle, xScroll, yScroll) {
    var areaDrawn = [0, 0];

    // loop through until we've drawn enough tiles to fill target img
    for (var y=0; y<this.height; y += this.image.height) {
      for (var x=0; x<this.width; x += this.image.width) {
        var spilloverX = Math.max(0, x + this.image.width - this.width);
        var spilloverY = Math.max(0, y + this.image.height - this.height);


        canvasContextHandle.drawImage(this.image,
            0, 0, // start clipping
            this.image.width - spilloverX, this.image.height - spilloverY, // height/width of clipped image
            this.xPos + x - xScroll, this.yPos + y - yScroll, // (x,y) to place image
            this.image.width - spilloverX, this.image.height - spilloverY); // (width,height) of image to use

      }
    }
  }

  this.drawRepeat = function(
      canvasContextHandle,
      newPosition,
      areaStillNeededToFill,
      newScrollPosition
    ) {
    // Find where in our repeating texure to start drawing (the top left corner);
    // normally this is 0, except for the first tile
    var xOffset = Math.abs(newScrollPosition[0]) % this.image.width;
    var yOffset = Math.abs(newScrollPosition[1]) % this.image.height;

    // (left, top) of where to start the image clipping
    var left = newScrollPosition[0] < 0 ? this.image.width - xOffset : xOffset;
    var top = newScrollPosition[1] < 0 ? this.image.height - yOffset : yOffset;

    // height and width of image to be drawn 
    var width = (areaStillNeededToFill[0] < this.image.width - left) ?
        areaStillNeededToFill[0] :
        this.image.width - left;
    var height = (areaStillNeededToFill[1] < this.image.height - top) ?
        areaStillNeededToFill[1] :
        this.image.height - top;

    // draw the image
    canvasContextHandle.drawImage(this.image,
        left, top, // start clipping
        width, height, // height/width of clipped image
        newPosition[0], newPosition[1], // (x,y) to place image
        width, height); // (width,height) of image to use

    return [width, height];
  }

  /**
   * Get the collision area. Override the VisualGameObject's version since you have an explicit height/width
   */
  this.collisionArea = function() {
    return {
      x: this.xPos,
      y: this.yPos,
      width: this.width,
      height: this.height
    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownDimensionedVisualGameObject = function() {
    // perform parent shutdown
    this.shutdownVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
DimensionedVisualGameObject.prototype = new VisualGameObject; // inheritance
