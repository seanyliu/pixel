/**
 * Spawns ground just outside the width of the screen.
 * Makes the game infinite!
 */
function Spawner() {
  this.spawnImage = null;
  this.lastSpawnXPos = 0;
  this.lastSpawnYPos = 0;

  // when the screen reaches the camera width + the buffer, draw another platform
  this.SPAWN_BUFFER = 100;

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupSpawner = function(
      spawnImage,
      xPos,
      yPos,
      zOrder,
      lastSpawnXPos, // in case you want to pre-make ground
      lastSpawnYPos, // in case you want to pre-make ground
      gameManager) {

    // perform parent class startup
    this.startupGameObject(xPos, yPos, zOrder, gameManager);

    // do this object's startup
    this.spawnImage = spawnImage;
    this.lastSpawnXPos = lastSpawnXPos;
    this.lastSpawnYPos = lastSpawnYPos;
  }

  /**
   * Draw from top left corner, shift based on how far user has scrolled on screen
   */
  /*
  this.draw = function(dt, canvasContextHandle, xScroll, yScroll) {
  }
  */

  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    if (xScroll + canvasContextHandle.canvas.width > this.lastSpawnXPos) {
      // TODO: randomize these variables!
      var spawnDistance = 50 + Math.random() * 130;
      var spawnY = this.lastSpawnYPos - 50 + Math.random() * 100;
      spawnY = Math.max(0, spawnY);
      spawnY = Math.min(900, spawnY);
      var spawnWidth = 30 + Math.random() * 100;

      var ground = new Ground();
      ground.startupGround(
        this.spawnImage,
        this.lastSpawnXPos + spawnDistance, // xPos
        spawnY, // yPos
        0, // zOrder
        spawnWidth, // width
        16, // height
        this.gameManager
      );

      this.lastSpawnXPos += spawnDistance + spawnWidth;
      this.lastSpawnYPos = spawnY;
    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownSpawner = function() {
    // perform parent shutdown
    this.shutdownGameObject();

    // perform self shutdown
    // N/A
  }
}
Spawner.prototype = new GameObject; // inheritance
