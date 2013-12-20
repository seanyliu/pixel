// Define globals
var GB_gameManager = null;
var GB_thread = null;
var g_image = new Image();
//g_image.src = "chain_armor_bandit.png";
g_image.src = "character2-sprites.png";
//g_image.src = "pixel-man.png";
var g_back2 = new Image();
g_back2.src = "bg-sky.png";
var g_back3 = new Image();
g_back3.src = "bg-trees.png";
var g_back4 = new Image();
g_back4.src = "bg-ground.png";
var g_block = new Image();
//g_block.src = "BlockA0.png";
g_block.src = "";
var g_gem = new Image();
g_gem.src = "powerup.png";

// Kick off the script
window.onload = function() {
  var canvasId = "pixel_canvas";
  var canvasElt = document.getElementById(canvasId);
  //canvasElt.height = document.body.offsetHeight;
  canvasElt.width = document.body.offsetWidth;
  init(canvasId);
}

function init(canvasId) {
  var myCanvasHandle = document.getElementById(canvasId);
  GB_gameManager = new GameManager(myCanvasHandle);
  GB_thread = GB_gameManager.start();

  var level = new Level();
  level.startupLevel(GB_gameManager);

  var bg = new RepeatingVisualGameObject();
  bg.startupRepeatingVisualGameObject(
    g_back2, // image
    0, // xPos
    0, // yPos
    -2, // zOrder
    GB_gameManager.mainContext.canvas.width, // width
    GB_gameManager.mainContext.canvas.height, // height
    0.5, // scrollFactor
    GB_gameManager
  );
  var bg3 = new RepeatingVisualGameObject();
  bg3.startupRepeatingVisualGameObject(
    g_back3, // image
    0, // xPos
    0, // yPos
    0, // zOrder
    GB_gameManager.mainContext.canvas.width, // width
    GB_gameManager.mainContext.canvas.height, // height
    1, // scrollFactor
    GB_gameManager
  );
  var bg4 = new RepeatingVisualGameObject();
  bg4.startupRepeatingVisualGameObject(
    g_back4, // image
    0, // xPos
    0, // yPos
    -1, // zOrder
    GB_gameManager.mainContext.canvas.width, // width
    GB_gameManager.mainContext.canvas.height, // height
    1, // scrollFactor
    GB_gameManager
  );

  // initialize game state
  var go = new Player();
  go.startupPlayer(g_image, level);
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
