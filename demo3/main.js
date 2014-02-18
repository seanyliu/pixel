// Define globals
var GB_gameManager = null;
var g_player = null; // TODO: used for the Powerup...() class. Get rid of this global call.

// Kick off the script
window.onload = function() {
  var canvasId = "pixel_canvas";

  // make the canvas take the entire width of the page
  var canvasElt = document.getElementById(canvasId);
  canvasElt.height = document.body.offsetHeight;
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
      { name: "ground", src: "assets/ground.png" },
      { name: "block", src: "assets/BlockA0.png" },
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

  // create ground
  var ground = new Ground();
  ground.startupGround(resourceManager.ground, 250, 400, 0, 400, 16, gameManager);
  var ground = new Ground();
  ground.startupGround(resourceManager.ground, 450, 250, 0, 30, 16, gameManager);
  var ground = new Ground();
  ground.startupGround(resourceManager.ground, 270, 350, 0, 30, 16, gameManager);

  // make the level infinite
  var spawner = new Spawner();
  spawner.startupSpawner(resourceManager.ground, resourceManager.powerup, 0, 0, 0, 650, 350, gameManager);

  // create the player
  var player = new PlayerCreature();
  player.startupPlayerCreature(resourceManager.character, gameManager);
  g_player = player;

  // create the player
  var monster = new HostileCreature();
  monster.startupHostileCreature(
    resourceManager.monster,
    250, // xPos
    400 - 64 - 120, // yPos
    0, // zOrder
    0, // frameStart
    0, // frameEnd
    120, // frameWidth
    120, // frameHeight
    45, // collisionWidth
    100, // collisionHeight
    gameManager
  );

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
  if (GB_gameManager.gameState["isAlive"] == 1) {
    GB_gameManager.start();
  }
}

function button_stop() {
  GB_gameManager.stop();
}

