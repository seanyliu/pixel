function GameState(canvasHandle)  {
  this.xPos=canvasHandle.width/2;
  this.yPos=canvasHandle.height/2;

}

GameState.prototype.update = function(canvasHandle)  {
  var contextHandle = canvasHandle.getContext('2d');
  contextHandle.clearRect(0,0,canvasHandle.width, canvasHandle.height);

  var hiWorldImg = new Image();
  hiWorldImg.src="hw.bmp";

  var xDelta = Math.round(10*Math.random() - 5);
  var yDelta = Math.round(10*Math.random() - 5);

  var xLowLim = 0;
  var yLowLim = 0;
  var xHiLim = canvasHandle.width - hiWorldImg.width;
  var yHiLim = canvasHandle.height - hiWorldImg.height;
  
  this.xPos = this.xPos+xDelta;
  this.yPos = this.yPos+yDelta;
  
  if (this.yPos<yLowLim)  {
    this.yPos = this.yPos+2*yDelta;
  } else if (this.yPos > yHiLim)  {
    this.yPos = this.yPos-2*yDelta;
  }

  if (this.xPos<xLowLim)  {
    this.xPos = this.xPos+2*yDelta;
  } else if (this.xPos > xHiLim)  {
    this.xPos = this.xPos-2*yDelta;
  }

  contextHandle.drawImage(hiWorldImg, this.xPos, this.yPos);  // draw from top left corner	
};
