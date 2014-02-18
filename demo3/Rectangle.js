/**
 * A rectangle
 */
function Rectangle() {
  this.left = 0;
  this.top = 0;
  this.width = 0;
  this.height = 0;
  this.gameManager = null; // not really used...just in case of inheritance

  /**
   * Initialize the rectangle
   */
  this.startupRectangle = function(
      left,
      top,
      width,
      height,
      gameManager) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.gameManager = gameManager;
  }

  /**
   * check intersection. True if intersects, false otherwise.
   */
  this.intersects = function( /**Rectangle*/ other) {
    if (this.left + this.width < other.left) {
      return false;
    }
    if (this.top + this.height < other.top) {
      return false;
    }
    if (this.left > other.left + other.width) {
      return false;
    }
    if (this.top > other.top + other.height) {
      return false;
    }
    return true;
  }
}
