/**
 * Manages any external resources used by the game
 */
function ResourceManager() {
  /**
   * An arry of the names of the images supplied to startupResourceManager.
   * Since the images are referenced by creating new properties
   * of the ResourceManager class, this collection allows a developer to
   * know which of the ResourceManager properties are images, and (by
   * elimination) those that are not.
   */
  this.imageProperties = null;
  this.resourcesLoaded = false;
  this.startupResourceManager = function(images) {
    this.imageProperties = new Array();

    // for each image, preload
    for (var i=0; i<images.length; i++) {
      var thisImage = new Image;
      this[images[i].name] = thisImage;
      this.imageProperties.push(images[i].name);
      thisImage.src = images[i].src;
    }
  }
}
