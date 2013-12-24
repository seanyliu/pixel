function PowerupAnimatedVisualGameObject() {

  // the score of a powerup
  this.value = 0;

  // current y position in the sine wave
  this.sinWavePos = 0;

  // how quickly powerup cycles through sin wave
  this.bounceTime = 1;

  // speed to increment the sinWavePos value
  this.bounceSpeed = Math.PI / this.bounceTime;

  // the height of the powerup's bounce
  this.bounceHeight = 10;

  this.startupPowerupAnimatedVisualGameObject = function(
      value, // score of the powerup
      image,
      xPos,
      yPos,
      zOrder,
      frameCount, // # of frames in the image
      fps, // for the animation
      gameManager) {
    this.startupAnimatedVisualGameObject(
      image,
      xPos,
      yPos - this.bounceHeight,
      zOrder,
      0, // frame to start with
      0, // frame to end with
      40, // frame width
      40, // frame height
      40, // collision width
      40, // collision height
      gameManager);
    this.value = value;
  }

  this.update = function(
      dt, canvasContextHandle, xScroll, yScroll) {
    var lastSinWavePos = this.sinWavePos;
    this.sinWavePos += this.bounceSpeed * dt;
    this.yPos += (Math.sin(this.sinWavePos) - Math.sin(lastSinWavePos)) * this.bounceHeight;

    // TODO: this should really be moved out into a collision detection function
    if (this.collisionArea().intersects(g_player.collisionArea())) {
      this.shutdownPowerupAnimatedVisualGameObject();
      this.gameManager.gameState["score"] += this.value;
      this.gameManager.updateScore(); // updates the score on the screen
    }
  }

  /**
   * Kill object.
   * Note: you MUST include shutdown<object> because
   * otherwise you'll clobber the parent's version!
   */
  this.shutdownPowerupAnimatedVisualGameObject = function() {
    // perform parent shutdown
    this.shutdownAnimatedVisualGameObject();

    // perform self shutdown
    // N/A
  }
}
PowerupAnimatedVisualGameObject.prototype = new AnimatedVisualGameObject; // inheritance
