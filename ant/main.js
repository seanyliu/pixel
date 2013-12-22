// Define globals
var GB_gameManager = null;
var GB_thread = null;
var GB_resourceManager = null;

var g_player = null; // TODO: used for the Powerup...() class. Get rid of this global call.
var g_score = 0; // TODO: this should be attached to the GameManager...

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
      { name: "ant", src: "ant.png" }
    ]
  );

  GB_gameManager = new GameManager(myCanvasHandle);
  GB_thread = GB_gameManager.start();

}

var NUM_ANTS = 10;
var GB_ants = new Array();
function initAfterLoading() {
  // initialize game state

  for (var i=0; i<NUM_ANTS; i++) {
    var ant = new Ant();
    ant.startupAnt(GB_resourceManager.ant, Math.random() * GB_gameManager.mainCanvas.width, Math.random() * GB_gameManager.mainCanvas.height);
    GB_ants.push(ant);
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
