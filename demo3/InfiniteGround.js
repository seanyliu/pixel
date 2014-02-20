/**
 * this works by creating a piece of ground that
 * is the width of the canvas and moves with the player
 */
function InfiniteGround() {
  // whether to include this in the
  // collision detection
  this.BOX_COLLIDER = true;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupInfiniteGround = function(image, yPos, zOrder, height, gameManager) {
    // perform parent class startup
    this.startupGround(
      image,
      gameManager.xScroll, // xPos
      yPos,
      zOrder, // zOrder
      gameManager.mainContext.canvas.width, // width
      height, // height
      gameManager
    );

    // NOTE: the xScroll as the xPos isn't quite flush
    // against the left edge, since we have to account
    // for the player's width. But not really a problem.
  }

  /**
   * Updates the object
   */
  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    this.xPos = xScroll;
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownInfiniteGround = function() {
    // perform parent shutdown
    this.shutdownGround();

    // perform self shutdown
    // N/A
  }
}
InfiniteGround.prototype = new Ground; // inheritance
