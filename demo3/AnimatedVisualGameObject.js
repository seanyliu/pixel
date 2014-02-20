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
  // collision rectangle (e.g. if the actual char is only the middle 10% of the frame!)
  // the collision rectangle is the following.  Note that the width is the middle
  // but the height starts from the bottom!
  // --------------------
  // |    frameWidth    |
  // |  _____________   |
  // |  | collision  |  |
  // |__|____________|__|
  this.collisionWidth = 0;
  this.collsionHeight = 0;

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
      collisionWidth,
      collisionHeight,
      animationSpeed,
      gameManager) {
    // error checking
    if (frameWidth <= 0) throw "frameWidth cannot be <= 0";
    if (frameHeight <= 0) throw "frameHeight cannot be <= 0";

    // perform parent class startup
    this.startupVisualGameObject(image, xPos, yPos, zOrder, gameManager);

    // do this object's startup
    this.timeBetweenFrames = 1/gameManager.FPS * animationSpeed;
    //this.timeBetweenFrames = 1/gameManager.FPS;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameColCount = image.width / frameWidth;
    this.frameRowCount = image.height / frameHeight;
    this.collisionWidth = collisionWidth;
    this.collisionHeight = collisionHeight;

    // kick off the animation
    this.setAnimation(frameStart, frameEnd);
  }

  /**
   * Sets the animation to be played.
   */
  this.setAnimation = function(
      frameStart, // frame to start with
      frameEnd // last frame
      ) {
    // do this object's startup
    this.currentFrame = frameStart;
    this.frameStart = frameStart;
    this.frameEnd = frameEnd;
    this.timeSinceLastFrame = this.timeBetweenFrames;
  }

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
   * Get the collision area. Override the VisualGameObject's version
   * since you may have frames in the image
   */
  this.collisionArea = function() {
    var xCollision = this.xPos + (this.frameWidth - this.collisionWidth)/2;
    var yCollision = this.yPos + (this.frameHeight - this.collisionHeight);
    return {
      x: xCollision,
      y: yCollision,
      width: this.collisionWidth,
      height: this.collisionHeight
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
