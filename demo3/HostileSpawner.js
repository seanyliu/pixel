/**
 * Spawns hostile creatures
 * Makes the game infinite!
 */
function HostileSpawner() {
  this.spawnImage = null;
  this.timeToNextSpawn = 0;
  this.MAX_SPAWN_TIME = 7.0; // will be a random interval between 0 and MAX_SPAWN_TIME

  /**
   * Initialize object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.startupHostileSpawner = function(
      spawnImage,
      xPos,
      yPos,
      zOrder,
      gameManager) {

    // perform parent class startup
    this.startupGameObject(xPos, yPos, zOrder, gameManager);

    // do this object's startup
    this.spawnImage = spawnImage;
    this.timeToNextSpawn = 0;
  }

  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    this.xPos = xScroll + this.gameManager.mainContext.canvas.width * 1.2;

    this.timeToNextSpawn = this.timeToNextSpawn - dt;

    if (this.timeToNextSpawn < 0) {
      // TODO: add a randomizer here
      this.timeToNextSpawn = this.MAX_SPAWN_TIME * Math.random();

      var monster = new HostileCreature();
      monster.startupHostileCreature(
        this.spawnImage,
        this.xPos, // xPos
        this.yPos, // yPos
        this.zOrder, // zOrder
        0, // frameStart
        2, // frameEnd
        130, // frameWidth
        130, // frameHeight
        80, // collisionWidth
        80, // collisionHeight
        this.gameManager
      );

    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownHostileSpawner = function() {
    // perform parent shutdown
    this.shutdownGameObject();

    // perform self shutdown
    // N/A
  }
}
HostileSpawner.prototype = new GameObject; // inheritance
