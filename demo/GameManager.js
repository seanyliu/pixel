/**
 * Manages all objects in the game
 */
function GameManager(canvasHandle) {

  /* Initialize Object */
  this.targetFPS = 20;

  // Get primary canvas
  this.mainCanvas = canvasHandle;
  this.mainContext = this.mainCanvas.getContext('2d');

  // create buffer
  this.backBufferCanvas = document.createElement('canvas');
  this.backBufferCanvas.width = this.mainCanvas.width;
  this.backBufferCanvas.height = this.mainCanvas.height;
  this.backBufferContext = this.backBufferCanvas.getContext('2d');

  // array of game objects
  this.gameObjects = new Array();

  // time since last frame rendered
  this.lastFrame = new Date().getTime();

  // pointer to the setInterval loop
  this.threadHandle = null;
}

/**
 * start rendering
 */
GameManager.prototype.start = function() {
  var threadHandle = setInterval(function() {
    GB_gameManager.render();
  }, 1000/this.targetFPS);
  return threadHandle;
}

/**
 * pause rendering
 */
GameManager.prototype.stop = function(threadHandle) {
  if (threadHandle === null) {
  } else {
    clearInterval(threadHandle);
  }
}

/**
 * actually render
 */
GameManager.prototype.render = function() {
  // calculate the time since the last frame
  var thisFrame = new Date().getTime();
  var dt = (thisFrame - this.lastFrame)/1000;
  this.lastFrame = thisFrame;

  // Clear back buffer
  this.backBufferContext.clearRect(0, 0,
    this.backBufferCanvas.width, this.backBufferCanvas.height
  );

  debug(this.gameObjects.length);

  // update loop
  for (var obj in this.gameObjects) {
    if (this.gameObjects[obj].update) {
      this.gameObjects[obj].update(dt, this.backBufferContext);
    }
  }

  // draw loop
  for (var obj in this.gameObjects) {
    if (this.gameObjects[obj].draw) {
      // TODO: add in xScroll and yScroll
      this.gameObjects[obj].draw(dt, this.backBufferContext, 0, 0);
    }
  }

  // Clear the main screen
  this.mainContext.clearRect(0, 0,
    this.backBufferCanvas.width, this.backBufferCanvas.height
  );

  // draw buffer to main screen
  this.mainContext.drawImage(this.backBufferCanvas, 0, 0);
}

/**
 * Register a new game object
 */
GameManager.prototype.addGameObject = function(gameObject) {
  this.gameObjects.push(gameObject);
  this.gameObjects.sort(function(a,b){return a.zOrder - b.zOrder;})
}

/**
 * Remove a game object
 */
GameManager.prototype.removeGameObject = function(gameObject) {
  this.gameObjects.removeObject(gameObject);
}
