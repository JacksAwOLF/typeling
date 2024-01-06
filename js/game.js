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
  tower.xCutoffPercentage = 0.3;
  tower.health = 10;
};

// update variables
const update = function (delta) {};

// render game
const render = function () {
  // draw background image
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0, window.innerWidth, window.innerHeight);
  }

  // draw tower vertical line
  ctx.beginPath();
  const lineX = window.innerWidth * tower.xCutoffPercentage;
  ctx.moveTo(lineX, 0);
  ctx.lineTo(lineX, window.innerHeight);
  ctx.lineWidth = 10;
  ctx.stroke();

  // draw the lanes

  // draw the words
};

canvas.onwheel = (e) => {
  e.preventDefault();
};
canvas.onmousewheel = (e) => {
  e.preventDefault();
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
