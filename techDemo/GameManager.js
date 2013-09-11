function GameManager(canvasHandle)  {

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

  // initialize game state
  this.gameState = new GameState(this.mainCanvas);


  this.threadHandle = null;
}

// start rendering
GameManager.prototype.start = function() {
  var threadHandle = setInterval(function()  {GB_gameManager.render();}, 1000/this.targetFPS);
  return threadHandle;
};

// pause rendering
GameManager.prototype.stop = function(threadHandle)  {
  if (threadHandle===null)  {
  }  else  {
    clearInterval(threadHandle);
  }
};

// actuall render
GameManager.prototype.render = function()  {
  // Clear buffer
  this.backBufferContext = this.backBufferCanvas.getContext('2d');
  this.backBufferContext.clearRect(0, 0, this.backBufferCanvas.width, this.backBufferCanvas.height);

  // Render to buffer
  this.gameState.update(this.backBufferCanvas);

  // Clear the main screen
  this.mainContext.clearRect(0, 0, this.backBufferCanvas.width, this.backBufferCanvas.height);

  // draw buffer to main screen
  this.mainContext.drawImage(this.backBufferCanvas, 0, 0);
};

