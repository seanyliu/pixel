// Define globals
var GB_gameManager = null;
var GB_thread = null;
var g_image = new Image();
g_image.src = "chain_armor_bandit.png";
var go = null;

// Kick off the script
window.onload = function() {
  init("pixel_canvas");
};

function init(canvasId) {
  var myCanvasHandle = document.getElementById(canvasId);
  GB_gameManager = new GameManager(myCanvasHandle);
  GB_thread = GB_gameManager.start();

  // initialize game state
  go = new Player();
  go.startupPlayer(g_image);
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
