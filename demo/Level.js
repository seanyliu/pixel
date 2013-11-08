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
      3, 2, 1, 1, 1, 1, 1, 1, 1, 2, 3
    ];
    this.addBlocks(gameManager);
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
        vgo.startupVisualGameObject(g_block, x * this.blockWidth, 400 - (y + 1) * this.blockHeight, 4, gameManager);
      }
    }
  }
}
