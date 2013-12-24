// Define globals
var GB_gameManager = null;
var GB_thread = null;
var GB_resourceManager = null;

var g_player = null; // TODO: used for the Powerup...() class. Get rid of this global call.
var g_score = 0; // TODO: this should be attached to the GameManager...

var NUM_ANTS = 18;
var GB_repellants = new Array();

// Kick off the script
window.onload = function() {
  var canvasId = "pixel_canvas";
  var canvasElt = document.getElementById(canvasId);
  //canvasElt.height = document.body.offsetHeight;
  //canvasElt.width = document.body.offsetWidth;
  init(canvasId);
}

function init(canvasId) {
  var myCanvasHandle = document.getElementById(canvasId);

  // create a new Resource Manager
  GB_resourceManager = new ResourceManager();
  GB_resourceManager.startupResourceManager(
    [
      { name: "ant", src: "ant.png" },
      { name: "repellant", src: "repellant.png" }
    ]
  );

  // listen for mouse clicks
  myCanvasHandle.addEventListener('click', getCanvasClick);

  // initilize the game manager thread
  GB_gameManager = new GameManager(myCanvasHandle);
  GB_thread = GB_gameManager.start();

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

function initAfterLoading() {
  // initialize game state

  // snake ants
  for (var i=0; i<NUM_ANTS/2; i++) {
    var ant = new Ant();
    ant.startupAnt(i, GB_resourceManager.ant, Math.random() * GB_gameManager.mainCanvas.width, Math.random() * GB_gameManager.mainCanvas.height);
    GB_gameManager.addAnt(ant);
  }

  // regular ants
  for (var i=0; i<NUM_ANTS/2; i++) {
    var ant = new Ant();
    ant.startupAnt(null, GB_resourceManager.ant, Math.random() * GB_gameManager.mainCanvas.width, Math.random() * GB_gameManager.mainCanvas.height);
    GB_gameManager.addAnt(ant);
  }
}

function button_start() {
  GB_thread = GB_gameManager.start();
}

function button_stop() {
  GB_gameManager.stop(GB_thread);
}

// debug function
function debug(text) {
  document.getElementById("debug").innerHTML = text;
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
