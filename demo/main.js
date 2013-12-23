// Define globals
var GB_gameManager = null;
var g_player = null; // TODO: used for the Powerup...() class. Get rid of this global call.

// Kick off the script
window.onload = function() {
  var canvasId = "pixel_canvas";

  // make the canvas take the entire width of the page
  var canvasElt = document.getElementById(canvasId);
  canvasElt.height = 600;
  canvasElt.width = document.body.offsetWidth;

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
      { name: "character", src: "assets/character2-sprites.png" },
      { name: "bgSky", src: "assets/bg-sky.png" },
      { name: "bgTrees", src: "assets/bg-trees.png" },
      { name: "bgGround", src: "assets/bg-ground.png" },
      //{ name: "block", src: "assets/BlockA0.png" },
      { name: "block", src: "" },
      { name: "powerup", src: "assets/powerup.png" },
      { name: "monster", src: "assets/monster.png" }
    ],
    myCanvasHandle,
    function() { // callback function
      initGameObjects(canvasId, resourceManager);
    }
  );
}

function initGameObjects(canvasId, resourceManager) {
  var myCanvasHandle = document.getElementById(canvasId);

  // start the game manager
  var gameManager = new GameManager(myCanvasHandle);
  GB_gameManager = gameManager;
  gameManager.start();

  // load the level
  var level = new Level();
  level.startupLevel(gameManager);

  // load the sky
  var bg = new RepeatingVisualGameObject();
  bg.startupRepeatingVisualGameObject(
    resourceManager.bgSky, // image
    0, // xPos
    0, // yPos
    -2, // zOrder
    gameManager.mainContext.canvas.width, // width
    gameManager.mainContext.canvas.height, // height
    0.5, // scrollFactor
    gameManager
  );

  // load the trees
  var bg3 = new RepeatingVisualGameObject();
  bg3.startupRepeatingVisualGameObject(
    resourceManager.bgTrees, // image
    0, // xPos
    0, // yPos
    0, // zOrder
    gameManager.mainContext.canvas.width, // width
    gameManager.mainContext.canvas.height, // height
    1, // scrollFactor
    gameManager
  );

  // load the ground
  var bg4 = new RepeatingVisualGameObject();
  bg4.startupRepeatingVisualGameObject(
    resourceManager.bgGround, // image
    0, // xPos
    0, // yPos
    -1, // zOrder
    gameManager.mainContext.canvas.width, // width
    gameManager.mainContext.canvas.height, // height
    1, // scrollFactor
    gameManager
  );

  // create the player
  var player = new Player();
  player.startupPlayer(resourceManager.character, level, gameManager);
  g_player = player;

  // create the monster
  var monster = new Creature();
  monster.startupCreature(resourceManager.monster, level, gameManager);
}

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

