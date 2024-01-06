// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
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

// tower image

// game objects
const tower = {};
// const

// set up game
const init = function () {
  // tower
  tower.x = 0;
  tower.y = 0;
  tower.width = 100;
  tower.height = 500;
  tower.health = 10;
};

// update variables
const update = function () {};

// render game
const render = function () {
  if (bgReady)
    ctx.drawImage(bgImage, 0, 0, window.innerWidth, window.innerHeight);
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

init();
main();
