// Define globals
var GB_gameManager = null;
var g_player = null; // TODO: used for the Powerup...() class. Get rid of this global call.

// Kick off the script
window.onload = function() {
  var canvasId = "pixel-canvas";

  // make the canvas take the entire width of the page
  var canvasElt = document.getElementById(canvasId);
  //canvasElt.height = document.body.offsetHeight;
  //canvasElt.width = document.body.offsetWidth;
  canvasElt.height = 400;
  canvasElt.width = document.body.offsetWidth * 0.75;

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
      { name: "character", src: "assets/underwear-man.png" },
      { name: "dog", src: "assets/dog.png" },
      { name: "bgScene", src: "assets/underwear-scene-full.png" },
      { name: "bgBuildings", src: "assets/underwear-buildings.png" },
      { name: "blank", src: "assets/blank.png" }
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

  // load the scene bg
  var bg = new RepeatingVisualGameObject();
  bg.startupRepeatingVisualGameObject(
    resourceManager.bgScene, // image
    0, // xPos
    0, // yPos
    -2, // zOrder
    gameManager.mainContext.canvas.width, // width
    gameManager.mainContext.canvas.height, // height
    0.7, // scrollFactor
    gameManager
  );

  // load the scene buildings
/*
  var bg = new RepeatingVisualGameObject();
  bg.startupRepeatingVisualGameObject(
    resourceManager.bgBuildings, // image
    0, // xPos
    0, // yPos
    -2, // zOrder
    gameManager.mainContext.canvas.width, // width
    gameManager.mainContext.canvas.height, // height
    0.1, // scrollFactor
    gameManager
  );
*/

  // create ground
  var ground = new InfiniteGround();
  ground.startupInfiniteGround(
    resourceManager.blank,
    350, // yPos
    0, // zOrder
    16, // height
    gameManager
  );

  // make the level infinite
  var spawner = new HostileSpawner();
  spawner.startupHostileSpawner(
    resourceManager.dog, // spawnImage
    gameManager.mainContext.canvas.width * 1.2, // xPos
    400 - 64 - 120, // yPos
    0, // zOrder
    6, // maxSpawnTime
    gameManager);

  // create the player
  var player = new PlayerCreature();
  player.startupPlayerCreature(resourceManager.character, gameManager);
  g_player = player;

/*
  var monster = new HostileCreature();
  monster.startupHostileCreature(
    resourceManager.dog,
    750, // xPos
    400 - 64 - 120, // yPos
    0, // zOrder
    0, // frameStart
    2, // frameEnd
    130, // frameWidth
    130, // frameHeight
    80, // collisionWidth
    80, // collisionHeight
    gameManager
  );
*/

  // create the player
/*
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
*/

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

