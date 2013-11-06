// Define globals
var GB_gameManager = null;
var GB_thread = null;
var g_image = new Image();
g_image.src = "chain_armor_bandit.png";
//g_image.src = "pixel-man.png";
var g_back2 = new Image();
g_back2.src = "black-stars.png";

// Kick off the script
window.onload = function() {
  init("pixel_canvas");
};

function init(canvasId) {
  var myCanvasHandle = document.getElementById(canvasId);
  GB_gameManager = new GameManager(myCanvasHandle);
  GB_thread = GB_gameManager.start();

  var bg = new RepeatingVisualGameObject();
  bg.startupRepeatingVisualGameObject(
    g_back2, // image
    0, // xPos
    0, // yPos
    0, // zOrder
    600, // width // TODO: if you make this (320, 600) it will crash!
    600, // height
    1, // scrollFactor
    GB_gameManager
  );

  // initialize game state
  var go = new Player();
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
