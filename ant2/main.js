// Define globals
var GB_gameManager = null;
var g_player = null; // TODO: used for the Powerup...() class. Get rid of this global call.

var NUM_ANTS = 18;
var GB_repellants = new Array();

// Kick off the script
window.onload = function() {
  var canvasId = "pixel_canvas";

  // kick off the loading
  initResourceManager(canvasId);
}

/**
 * Creates a new resource manager which calls the callback()
 * after all the assets have loaded.
 */
function initResourceManager(canvasId) {
  var myCanvasHandle = document.getElementById(canvasId);
  var resourceManager = new ResourceManager();
  resourceManager.startupResourceManager(
    [
      { name: "ant", src: "assets/ant.png" },
      { name: "repellant", src: "assets/repellant.png" }
    ],
    myCanvasHandle,
    function() { // callback function
      initGameObjects(canvasId, resourceManager);
    }
  );

  // listen for mouse clicks
  myCanvasHandle.addEventListener('click', getCanvasClick);
}

function initGameObjects(canvasId, resourceManager) {
  var myCanvasHandle = document.getElementById(canvasId);

  // start the game manager
  var gameManager = new GameManager(myCanvasHandle);
  GB_gameManager = gameManager;
  gameManager.start();

  // snake ants
  for (var i=0; i<NUM_ANTS/2; i++) {
    var ant = new Ant();
    ant.startupAnt(
      i,
      GB_resourceManager.ant,
      Math.random() * GB_gameManager.mainCanvas.width,
      Math.random() * GB_gameManager.mainCanvas.height
    );
    GB_gameManager.addAnt(ant);
  }

  // regular ants
  for (var i=0; i<NUM_ANTS/2; i++) {
    var ant = new Ant();
    ant.startupAnt(null,
      GB_resourceManager.ant,
      Math.random() * GB_gameManager.mainCanvas.width,
      Math.random() * GB_gameManager.mainCanvas.height
    );
    GB_gameManager.addAnt(ant);
  }
}

function getCanvasClick(event) {
  var myCanvasHandle = document.getElementById("pixel_canvas"); // TODO: don't have the call hardcoded here
  coords = myCanvasHandle.relMouseCoords(event);
  canvasX = coords.x;
  canvasY = coords.y;

  var repellant = new Repellant();
  repellant.startupRepellant(
    GB_resourceManager.repellant,
    canvasX,
    canvasY,
    0, // zOrder
    0, // frameStart
    0, // frameEnd
    3, // frameWidth
    3, // frameHeight
    GB_gameManager
  );
  GB_gameManager.addRepellant(repellant);
}

/**
 * get the mouse click location
 * http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
 */
function relMouseCoords(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this;

  do {
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  } while(currentElement = currentElement.offsetParent);

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

// debug function
function debug(text) {
  document.getElementById("debug").innerHTML = text;
}

// pause the game if the user isn't focused on the current window
$(window).blur(function() {
  button_stop();
});

$(window).focus(function() {
  button_start();
});

function button_start() {
  GB_gameManager.start();
}

function button_stop() {
  GB_gameManager.stop();
}

