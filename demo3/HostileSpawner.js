/**
 * Spawns hostile creatures
 * Makes the game infinite!
 */
function HostileSpawner() {
  this.spawnImage = null;
  this.timeToNextSpawn = 0;
  this.maxSpawnTime = 7.0; // will be a random interval between 0 and maxSpawnTime

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
      maxSpawnTime,
      gameManager) {

    // perform parent class startup
    this.startupGameObject(xPos, yPos, zOrder, gameManager);

    // do this object's startup
    this.spawnImage = spawnImage;
    this.maxSpawnTime = maxSpawnTime;
    this.timeToNextSpawn = Math.random() * maxSpawnTime;
  }

  this.update = function(dt, canvasContextHandle, xScroll, yScroll) {
    this.xPos = xScroll + this.gameManager.mainContext.canvas.width * 1.2;

    this.timeToNextSpawn -= dt;

    if (this.timeToNextSpawn < 0) {
      // TODO: add a randomizer here
      this.timeToNextSpawn = this.maxSpawnTime * Math.random();

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
