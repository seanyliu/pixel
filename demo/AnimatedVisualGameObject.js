function AnimatedVisualGameObject() {

  // Frame to be rendered
  this.currentFrame = 0;
  // defines frames per second (1/fps)
  this.timeBetweenFrames = 0;
  this.timeSinceLastFrame = 0;
  // size of each frame
  this.frameWidth = 0;
  this.frameHeight = 0;
  // number of rows/cols in sprite
  this.frameRowCount = 0;
  this.frameColCount = 0;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupAnimatedVisualGameObject = function(
      image,
      xPos,
      yPos,
      zOrder,
      frameStart, // frame to start with
      frameEnd, // last frame
      frameWidth,
      frameHeight,
      gameManager) {
    // error checking
    if (frameWidth <= 0) throw "frameWidth cannot be <= 0";
    if (frameHeight <= 0) throw "frameHeight cannot be <= 0";

    // perform parent class startup
    this.startupVisualGameObject(image, xPos, yPos, zOrder, gameManager);

    // do this object's startup
    this.currentFrame = frameStart;
    this.frameStart = frameStart;
    this.frameEnd = frameEnd;
    this.timeBetweenFrames = 1/gameManager.FPS;
    this.timeSinceLastFrame = this.timeBetweenFrames;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameColCount = image.width / frameWidth;
    this.frameRowCount = image.height / frameHeight;
  }

  /**
   * TEST FUNCTION
   * TODO: delete
   */
  /*
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
  */

  /**
   * Draw from top left corner, shift based on how far user has scrolled on screen
   */
  this.draw = function(dt, canvasContextHandle, xScroll, yScroll) {
    var frameX = this.currentFrame % this.frameColCount;
    var frameY = Math.floor(this.currentFrame / this.frameColCount);
    var sourceX = frameX * this.frameWidth;
    var sourceY = frameY * this.frameHeight;
    canvasContextHandle.drawImage(this.image,
      sourceX, sourceY, // coordinates of clipping
      this.frameWidth, this.frameHeight, // dimensions
      this.xPos - xScroll, this.yPos - yScroll, // placement
      this.frameWidth, this.frameHeight
    ); // width of image to use

    this.timeSinceLastFrame -= dt;
    if (this.timeSinceLastFrame <= 0) {
      this.timeSinceLastFrame = this.timeBetweenFrames;
      ++this.currentFrame;
      if (this.currentFrame > this.frameEnd) {
        this.currentFrame = this.frameStart;
      }
    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownAnimatedVisualGameObject = function() {
    // perform parent shutdown
    this.shutdownVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
AnimatedVisualGameObject.prototype = new VisualGameObject; // inheritance