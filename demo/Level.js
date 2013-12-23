/**
 * Define a level in the game
 */
function Level() {
  this.blocks = new Array();
  this.blockWidth = 64;
  this.blockHeight = 48;

  /**
   * Initialize the object
   */
  this.startupLevel = function(gameManager) {
    this.blocks = [
      // 3, 2, 1, 1, 1, 1, 1, 1, 1, 2, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 3, 2, 1
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ];
    this.powerups = [
      'Gem', , , , , 'Gem', , , , 'Gem'
    ];
    this.addBlocks(gameManager);
    this.addPowerups(gameManager);
  }

  /**
   * Adds the blocks to the screen by creating VisualGameObjects
   */
  this.addBlocks = function(gameManager) {
    for (var x=0; x<this.blocks.length; x++) {
      for (var y=0; y<this.blocks[x]; y++) {
        // TODO: store the block objects so you can shut them down
        // if needed!
        var vgo = new VisualGameObject();
        // TODO: kill GB_resourceManager
        vgo.startupVisualGameObject(GB_resourceManager.block, x * this.blockWidth, gameManager.mainContext.canvas.height - (y + 1) * this.blockHeight, 4, gameManager);
      }
    }
  }

  /**
   * Adds powerups to the screen
   */
  this.addPowerups = function(gameManager) {
    for (var x=0; x<this.blocks.length; x++) {
      if (this.powerups[x]) {
        var xPosition = x * this.blockWidth + this.blockWidth/2;
        var yPosition = gameManager.mainContext.canvas.height - this.groundHeight(x);
        switch (this.powerups[x]) {
          case 'Gem':
            new PowerupAnimatedVisualGameObject().startupPowerupAnimatedVisualGameObject(
              10, // value
              GB_resourceManager.powerup, // image
              xPosition - GB_resourceManager.powerup.width, // x position
              yPosition - GB_resourceManager.powerup.height, // y position
              4, // zOrder
              1, // frameCount
              1, // fps
              gameManager
            );
            break;
        }
      }
    }
  }

  /**
   * Returns the block under the specified x position
   */
  this.currentBlock = function(x) {
    return parseInt(x/this.blockWidth);
  }

  /**
   * Returns the height of the ground under the specified block
   */
  this.groundHeight = function(blockIndex) {
    if (blockIndex < 0 || blockIndex > this.blocks.length) return 0;
    return this.blocks[blockIndex] * this.blockHeight;
  }
}
