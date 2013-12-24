/**
 * Manages all objects in the game
 */
function GameManager(canvasHandle) {

  this.gameMode = 0; // regular/default mode

  /* Initialize Object */
  this.FPS = 20;

  // Get primary canvas
  this.mainCanvas = canvasHandle;
  this.mainContext = null;

  // resource loading
  //this.resourcesLoaded = false; // in ResourceManager
  // current color of the loading screen
  this.loadingScreenCol = 255;
  // direction of the changes to loading screen color: + = white, - = black
  this.loadingScreenColDirection = -1;
  // how quickly to change the loading screen color per second
  this.loadingScreenColSpeed = 10;

  // create buffer
  this.backBufferCanvas = document.createElement('canvas');
  this.backBufferCanvas.width = this.mainCanvas.width;
  this.backBufferCanvas.height = this.mainCanvas.height;
  this.backBufferContext = null;

  // array of game objects
  this.gameObjects = new Array();

  // array of repellants
  // TODO: this should really just use gameObjects
  this.repellants = new Array();
  this.ants = new Array();

  // time since last frame rendered
  this.lastFrame = new Date().getTime();
  this.xScroll = 0; // scrolling of the x axis
  this.yScroll = 0; // scrolling of the y axis

  // pointer to the setInterval loop
  this.threadHandle = null;

  // watch for keyboard events
  document.onkeyup = function(event) {
    GB_gameManager.keyUp(event);
  }
  document.onkeydown = function(event) {
    GB_gameManager.keyDown(event);
  }
}

/**
 * Change the game mode.  E.g. 0=regular,
 * 1 = snake, etc.
 */
GameManager.prototype.setMode = function(mode) {
  this.gameMode = mode;
}

/**
 * start rendering
 */
GameManager.prototype.start = function() {
  // old ie doesn't support canvas
  if (this.mainCanvas.getContext) {
    this.mainContext = this.mainCanvas.getContext('2d');
    this.backBufferContext = this.backBufferCanvas.getContext('2d');
    var threadHandle = setInterval(function() {
      GB_gameManager.render();
    }, 1000/this.FPS);
    return threadHandle;
  } else {
    return null;
  }
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

  if (!GB_resourceManager.resourcesLoaded) {
    var numLoaded = 0;
    for (i=0; i<GB_resourceManager.imageProperties.length; i++) {
      if (GB_resourceManager[GB_resourceManager.imageProperties[i]].complete) {
        numLoaded++;
      }
    }
    if (numLoaded == GB_resourceManager.imageProperties.length) {
      GB_resourceManager.resourcesLoaded = true;
      initAfterLoading(); // TODO: fix how this call is done.  Should be part of main.js
    } else {
      this.loadingScreenCol += this.loadingScreenColDirection * this.loadingScreenColSpeed * dt;
      if (this.loadingScreenCol > 255) {
        this.loadingScreenCol = 255;
        this.loadingScreenColDirection = -1;
      } else if (this.loadingScreenCol < 0) {
        this.loadingScreenCol = 0;
        this.loadingScreenColDirection = 1;
      }
      this.mainContext.fillStyle = "rgb(" + parseInt(this.loadingScreenCol) + "," + parseInt(this.loadingScreenCol) + "," + parseInt(this.loadingScreenCol) + ")";
      this.mainContext.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    }
  }

  if (GB_resourceManager.resourcesLoaded) {

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

    // TODO: add an intersect loop here

    // Clear the main screen
    this.mainContext.clearRect(0, 0,
      this.backBufferCanvas.width, this.backBufferCanvas.height
    );

    // draw buffer to main screen
    this.mainContext.drawImage(this.backBufferCanvas, 0, 0);

  }
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

/**
 * Process keyboard controls: keyUp
 */
GameManager.prototype.keyUp = function(event) {
  for (var obj in this.gameObjects) {
    if (this.gameObjects[obj].keyUp) {
      this.gameObjects[obj].keyUp(event);
    }
  }
}

/**
 * Process keyboard controls: keyDown
 */
GameManager.prototype.keyDown = function(event) {
  //debug("keyDown"+event.keyCode);
  for (var obj in this.gameObjects) {
    if (this.gameObjects[obj].keyDown) {
      this.gameObjects[obj].keyDown(event);
    }
  }
}

GameManager.prototype.updateScore = function() {
  var score = document.getElementById("score");
  score.innerHTML = String(g_score);
}

GameManager.prototype.addRepellant = function(repellant) {
  this.repellants.push(repellant);
}

GameManager.prototype.removeRepellant = function(repellant) {
  this.repellants.removeObject(repellant);
}

GameManager.prototype.addAnt = function(ant) {
  this.ants.push(ant);
}

GameManager.prototype.removeAnt = function(ant) {
  this.ants.removeObject(ant);
}
