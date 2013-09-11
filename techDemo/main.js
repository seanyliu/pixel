// Define globals
var GB_gameManager = null;
window.onload = init;

var GB_thread = null;

function init()
{
  var myCanvasHandle = document.getElementById("pixel_canvas");
  GB_gameManager = new GameManager(myCanvasHandle);
  GB_thread=GB_gameManager.start();
}

function button_start()
{
  GB_thread=GB_gameManager.start();
}

function button_stop()
{
  GB_gameManager.stop(GB_thread);
}


