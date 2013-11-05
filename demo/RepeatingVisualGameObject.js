function RepeatingVisualGameObject() {
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
  this.startupRepeatingVisualGameObject = function(
      image,
      xPos,
      yPos,
      zOrder,
      width, // dimension of final image
      height, // dimension of final image
      scrollFactor,
      gameManager) {

    // perform parent class startup
    this.startupVisualGameObject(image, xPos, yPos, zOrder, gameManager);

    // do this object's startup
    this.width = width;
    this.height = height;
    this.scrollFactor = scrollFactor;
  }

  /**
   * Draw from top left corner, shift based on how far user has scrolled
   * on screen. Draws such that the repeating tiles fill the size of the
   * target image height/width
   */
  this.draw = function(dt, canvasContextHandle, xScroll, yScroll) {
    var areaDrawn = [0, 0];

    // loop through until we've drawn enough tiles to fill target img
    for (var y=0; y<this.height; y += areaDrawn[1]) {
      for (var x=0; x<this.height; x += areaDrawn[0]) {

        // top left corner to start drawing next tile from
        var newPosition = [this.xPos + x, this.yPos + y];

        // amount of space left in which to draw
        var areaStillNeededToFill = [this.width - x, this.height - y];

        // first time around you have to start drawing from the middle
        // of an image. Subsequent tiles get drawn from top or left.
        var newScrollPosition = [0, 0];

        if (x == 0) {
          newScrollPosition[0] = xScroll * this.scrollFactor;
        }
        if (y == 0) {
          newScrollPosition[1] = yScroll * this.scrollFactor;
        }

        // draw the tile
        areaDrawn = this.drawRepeat(canvasContextHandle,
          newPosition,
          areaStillNeededToFill,
          newScrollPosition
        );
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
        this.image.width, this.image.height, // height/width of clipped image
        newPosition[0], newPosition[1], // (x,y) to palce image
        this.image.width, this.image.height); // (width,height) of image to use

    return [width, height];
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownRepeatingVisualGameObject = function() {
    // perform parent shutdown
    this.shutdownVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
RepeatingVisualGameObject.prototype = new VisualGameObject; // inheritance
