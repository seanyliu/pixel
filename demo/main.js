// Define globals
var GB_gameManager = null;
var GB_thread = null;
var GB_resourceManager = null;

var g_player = null; // TODO: used for the Powerup...() class. Get rid of this global call.
var g_score = 0; // TODO: this should be attached to the GameManager...

// pause the game if the user isn't focused on the current window
$(window).blur(function() {
  button_stop();
});

$(window).focus(function() {
  button_start();
});

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

  // create a new Resource Manager
  GB_resourceManager = new ResourceManager();
  GB_resourceManager.startupResourceManager(
    [
      { name: "character", src: "assets/character2-sprites.png" },
      { name: "bgSky", src: "assets/bg-sky.png" },
      { name: "bgTrees", src: "assets/bg-trees.png" },
      { name: "bgGround", src: "assets/bg-ground.png" },
      { name: "block", src: "" },
      { name: "powerup", src: "assets/powerup.png" },
      { name: "monster", src: "assets/monster.png" }
    ]
  );

  GB_gameManager = new GameManager(myCanvasHandle);
  GB_thread = GB_gameManager.start();

}

function initAfterLoading() {

  var level = new Level();
  level.startupLevel(GB_gameManager);

  var bg = new RepeatingVisualGameObject();
  bg.startupRepeatingVisualGameObject(
    GB_resourceManager.bgSky, // image
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
    GB_resourceManager.bgTrees, // image
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
    GB_resourceManager.bgGround, // image
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
  go.startupPlayer(GB_resourceManager.character, level);
  g_player = go;

  var monster = new Creature();
  monster.startupCreature(GB_resourceManager.monster, level);
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
