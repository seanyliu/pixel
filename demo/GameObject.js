/**
 * Most base class for all other game objects
 */
function GameObject() {
  this.gameManager = null;
  this.zOrder = 0;
  this.xPos = 0;
  this.yPos = 0;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupGameObject = function(xPos, yPos, zOrder, gameManager) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.zOrder = zOrder;
    this.gameManager = gameManager;
    gameManager.addGameObject(this);
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownGameObject = function() {
    this.gameManager.removeGameObject(this);
  }
}
