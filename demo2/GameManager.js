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
    "score": 0,
    "isAlive": 1
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
    if (this.threadHandle === null) {
      this.lastFrame = new Date().getTime();
      this.threadHandle = setInterval(function() {
        GB_gameManager.render();
      }, 1000/this.FPS);
    }
  }

  /**
   * pause rendering
   */
  this.stop = function() {
    if (this.threadHandle === null) {
    } else {
      clearInterval(this.threadHandle);
      this.threadHandle = null;
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

    // collision loop. Note that because we start aIdx and bIdx from 0,
    // it will execute BOTH a.collide(b) and b.collide(a)
    // TODO: only check collisions of objects on screen
    for (var aIdx=0; aIdx<this.gameObjects.length; aIdx++) {
      var objA = this.gameObjects[aIdx];
      if (!objA.BOX_COLLIDER || !objA.collisionArea) continue;

      for (var bIdx=0; bIdx<this.gameObjects.length; bIdx++) {
        var objB = this.gameObjects[bIdx];
        if (!objB.BOX_COLLIDER || !objB.collisionArea) continue;

        // check if objects intersect
        if (objA != objB && this.intersectsOrTouches(objA.collisionArea(), objB.collisionArea())) {
          // call the collision functions
          if (objA.collide) {
            objA.collide(objB);
          }
        }
      }
    }

    // draw loop
    for (var obj in this.gameObjects) {
      if (this.gameObjects[obj].draw) {
        this.gameObjects[obj].draw(dt, this.backBufferContext, this.xScroll, this.yScroll);
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
   * check intersection. True if intersects OR TOUCHES, false otherwise.
   * a and b should have properties:
   * .x, .y, .width, .height
   */
  this.intersectsOrTouches = function(a, b) {
    // touching is important because we need to clear the player grounded
    // flag.  I.e. if you use a strict intersection, then you'll get:
    // * player lands on ground. VelY = 0;
    // * now player grounded set to false.
    // * but not intersecting! so will miss keyboard jump input
    // * now player falls and grounded set to true.
    // BUT we need the strict intersection so we don't push the
    // the player all the way off the screen to the left or right of the ground
    // when they are simply touching it.
    if (a.x + a.width < b.x) {
      return false;
    }
    if (a.y + a.height < b.y) {
      return false;
    }
    if (a.x > b.x + b.width) {
      return false;
    }
    if (a.y > b.y + b.height) {
      return false;
    }
    return true;
  }

  /**
   * check intersection. True if intersects strictly. Touching doesn't count!
   * used by Player.js
   * a and b should have properties:
   * .x, .y, .width, .height
   */
  this.intersectsStrictly = function(a, b) {
    // need equals signs to exclude just touching (but not
    // actually overlapping!)
    if (a.x + a.width <= b.x) {
      return false;
    }
    if (a.y + a.height <= b.y) {
      return false;
    }
    if (a.x >= b.x + b.width) {
      return false;
    }
    if (a.y >= b.y + b.height) {
      return false;
    }
    return true;
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

  /**
   * Game over
   */
  this.gameOver = function() {
    this.gameState["isAlive"] = 0;
    // TODO: this should really just be an element vs a div?
    $("#gameover-container").show();
    this.stop();
  }
}

