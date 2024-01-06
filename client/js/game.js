import { lanes, removeWord, addWordToLane } from "./lane.js";
import { incWordsTpyed, displayWPM } from "./wpm.js";

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 720;
canvas.style =
  "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
document.body.appendChild(canvas);

// create the word input box
// or should we just draw this in the canvas?
const wordInput = document.createElement("input");
wordInput.style = "position: absolute; top: 80%; left: 40%;";
wordInput.onkeydown = (e) => {
  if (e.key === " " || e.key === "Enter") {
    const val = e.target.value.trim();
    for (let i = 0; i < lanes.length; i++) {
      for (let j = 0; j < lanes[i].words.length; j++) {
        const word = lanes[i].words[j];
        if (val === word.text && word.x < canvas.width) {
          removeWord(i, j);
          e.target.value = "";
          incWordsTpyed();
          break;
        }
      }
    }
  }

  if (e.key === " ") e.preventDefault();
};
document.body.appendChild(wordInput);

// background image
let bgReady = false;
const bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/plantsVzombies.jpeg";

// font and color for main stream of words
// should i add this to the lane object?
const mainTextFont = "30px Comic Sans Ms";
const mainTextColor = "black";

// left side bar for viewing other player info
const leftWidth = 0;

// bottomw bar to view special attack and charging
const bottomHeight = 0;

// tower game object
const tower = {};

// words game objects
let words = [];
const wordHeight = 20;
const mainLaneY = (window.innerHeight - wordHeight) / 2;

// set up game
const init = function () {
  // tower
  tower.xCutoffPercentage = 0.25;
  tower.health = 10;
};

const mainLaneInd = 0;

// update variables
const update = function (delta) {
  // if (txtReady) {
  // add words if necessary
  ctx.font = mainTextFont;
  ctx.fillStyle = mainTextColor;
  for (let i = 0; i < lanes.length; i++) {
    while (lanes[i].words.length < 50) {
      addWordToLane(i, ctx, canvas.width);
    }
  }

  // update each word x position in each lane
  for (let i = 0; i < lanes.length; i++) {
    for (let j = 0; j < lanes[i].words.length; j++) {
      lanes[i].words[j].x -= lanes[i].pps * delta;
      // check if hit the tower
      if (lanes[i].words[j].x < canvas.width * tower.xCutoffPercentage) {
        tower.health -= 1;
        removeWord(i, j);
      }
    }
  }
  // }
};

// render game
const render = function () {
  // draw background image
  if (bgReady) {
    ctx.drawImage(
      bgImage,
      leftWidth,
      0,
      canvas.width - leftWidth,
      canvas.height
    );
  }

  // draw left bar
  // draw bottom bar

  // draw tower vertical line
  ctx.beginPath();
  const lineX = canvas.width * tower.xCutoffPercentage;
  ctx.moveTo(lineX, 0);
  ctx.lineTo(lineX, canvas.height);
  ctx.lineWidth = 10;
  ctx.stroke();

  // draw the lanes

  // draw the words
  ctx.font = mainTextFont;
  ctx.fillStyle = mainTextColor;
  for (let i = 0; i < lanes.length; i++) {
    for (let j = 0; j < lanes[i].words.length; j++) {
      const word = lanes[i].words[j];
      ctx.fillText(word.text, word.x, word.y);
    }
  }

  displayWPM(ctx);
};

let then = Date.now();
const main = function () {
  let now = Date.now();
  let delta = now - then;
  then = now;
  update(delta / 1000);
  render();

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
const w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

init();
main();
