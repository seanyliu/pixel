/**
 * need this global variable for the setTimeout function such that
 * 'this' will not refer to 'window' */
GB_resourceManager = null;

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
  this.imageProperties = new Array();
  this.resourcesLoaded = false;

  /**
   * resource loading config
   */
  // current color of the loading screen
  this.loadingScreenColor = 0;
  // direction of the changes to loading screen color: + = white, - = black
  this.loadingScreenColorDirection = 1;
  // how quickly to change the loading screen color per second
  this.LOADING_SCREEN_COLOR_SPEED = 255;

  // for drawing the loading screen
  this.mainCanvas = null;
  this.mainContext = null;
  this.lastFrame = new Date().getTime();
  this.FPS = 20;

  // call this after the images have loaded
  this.callback = null;

  this.startupResourceManager = function(images, mainCanvas, callback) {
    GB_resourceManager = this;

    this.mainCanvas = mainCanvas;
    this.mainContext = this.mainCanvas.getContext('2d');
    this.callback = callback;

    // for each image, preload
    for (var i=0; i<images.length; i++) {
      var thisImage = new Image;
      this[images[i].name] = thisImage;
      this.imageProperties.push(images[i].name);
      thisImage.src = images[i].src;
    }

    // render the loading screen
    this.renderLoading();
  }

  /**
   * returns true/false whether or not all the resources
   * have finished loading.
   */
  this.resourcesFinishedLoading = function() {
    var numLoaded = 0;
    for (i=0; i<this.imageProperties.length; i++) {
      if (this[this.imageProperties[i]].complete) {
        numLoaded++;
      }
    }
    if (numLoaded == this.imageProperties.length) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * render loop to show the loading screen
   */
  this.renderLoading = function() {
    var thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;

    // change the color while we load
    this.loadingScreenColor += this.loadingScreenColorDirection *
        this.LOADING_SCREEN_COLOR_SPEED * dt;
      if (this.loadingScreenColor > 255) {
        this.loadingScreenColor = 255;
        this.loadingScreenColorDirection = -1;
      } else if (this.loadingScreenColor < 0) {
        this.loadingScreenColor = 0;
        this.loadingScreenColorDirection = 1;
      }
      this.mainContext.fillStyle = "rgb(" +
          parseInt(this.loadingScreenColor) + "," +
          parseInt(this.loadingScreenColor) + "," +
          parseInt(this.loadingScreenColor) + ")";
      this.mainContext.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
 
    // check if we're done loading 
    if (this.resourcesFinishedLoading()) {
      this.callback();
    } else {
      // MUST use a global reference unfortunately.  If you call this.renderLoading() inside,
      // it will think 'this' is the var window
      setTimeout(function() { GB_resourceManager.renderLoading() }, 1000/this.FPS);
    }
  }

}


