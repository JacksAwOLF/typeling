// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.screen.width;
canvas.height = window.screen.height;
document.body.appendChild(canvas);

// background image
let bgReady = false;
const bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/plantsVzombies.jpeg";

// game objects

// set up game
const reset = function () {};

// update variables
const update = function () {};

// render game
const render = function () {
  if (bgReady) ctx.drawImage(bgImage, 0, 0);
};

const main = function () {
  let now = Date.now();
  let delta = now - then;
  update(delta / 1000);
  render();

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

let then = Date.now();

reset();
main();
