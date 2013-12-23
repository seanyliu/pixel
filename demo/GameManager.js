/**
 * Manages all objects in the game
 */
function GameManager(canvasHandle) {

  /* Initialize Object */
  this.FPS = 20;

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
  this.gamePlayers = new Array();

  // time since last frame rendered
  this.lastFrame = new Date().getTime();
  this.xScroll = 0; // scrolling of the x axis
  this.yScroll = 0; // scrolling of the y axis

  // pointer to the setInterval loop
  this.threadHandle = null;

  // game state (score, saving, etc)
  this.gameState = {
    "score": 0
  }

  // watch for keyboard events
  document.onkeyup = function(event) {
    GB_gameManager.keyUp(event);
  }
  document.onkeydown = function(event) {
    GB_gameManager.keyDown(event);
  }

  /**
   * start rendering
   */
  this.start = function() {

    // start the main game loop
    var threadHandle = setInterval(function() {
      GB_gameManager.render();
    }, 1000/this.FPS);
    return threadHandle;
  }

  /**
   * pause rendering
   */
  this.stop = function(threadHandle) {
    if (threadHandle === null) {
    } else {
      clearInterval(threadHandle);
    }
  }

  /**
   * actually render
   */
  this.render = function() {
    // calculate the time since the last frame
    var thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;

    // Clear back buffer
    this.backBufferContext.clearRect(0, 0,
      this.backBufferCanvas.width, this.backBufferCanvas.height
    );

    // update loop
    for (var obj in this.gameObjects) {
      if (this.gameObjects[obj].update) {
        this.gameObjects[obj].update(dt, this.backBufferContext, this.xScroll, this.yScroll);
      }
    }

    // draw loop
    for (var obj in this.gameObjects) {
      if (this.gameObjects[obj].draw) {
        this.gameObjects[obj].draw(dt, this.backBufferContext, this.xScroll, this.yScroll);
      }
    }

    // TODO: add an intersect loop her
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
  this.addGameObject = function(gameObject) {
    this.gameObjects.push(gameObject);
    this.gameObjects.sort(function(a,b){return a.zOrder - b.zOrder;})
  }

  /**
   * Remove a game object
   */
  this.removeGameObject = function(gameObject) {
    this.gameObjects.removeObject(gameObject);
  }

  /**
   * Process keyboard controls: keyUp
   */
  this.keyUp = function(event) {
    for (var obj in this.gameObjects) {
      if (this.gameObjects[obj].keyUp) {
        this.gameObjects[obj].keyUp(event);
      }
    }
  }

  /**
   * Process keyboard controls: keyDown
   */
  this.keyDown = function(event) {
    //debug("keyDown"+event.keyCode);
    for (var obj in this.gameObjects) {
      if (this.gameObjects[obj].keyDown) {
        this.gameObjects[obj].keyDown(event);
      }
    }
  }

  /**
   * Updates the score
   */
  this.updateScore = function() {
    var score = document.getElementById("score");
    score.innerHTML = String(this.gameState["score"]);
  }
}

