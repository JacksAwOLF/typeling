import { lanes, removeWord, addWordToLane, renderWords } from "./lane.js";
import { incWordsTyped, renderStats, startTimer, takeDamage } from "./stats.js";
import { canvW, canvH, xCutoffPercentage } from "./gvars.js";

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvW;
canvas.height = canvH;
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
          incWordsTyped();
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

// left side bar for viewing other player info
const leftWidth = 0;

// bottomw bar to view special attack and charging
const bottomHeight = 0;

// update variables
const update = function (delta) {
  // if (txtReady) {
  // add words if necessary

  for (let i = 0; i < lanes.length; i++) {
    while (lanes[i].words.length < 50) {
      addWordToLane(i, ctx);
    }
  }

  // update each word x position in each lane
  for (let i = 0; i < lanes.length; i++) {
    for (let j = 0; j < lanes[i].words.length; j++) {
      lanes[i].words[j].x -= lanes[i].pps * delta;
      // check if hit the tower
      if (lanes[i].words[j].x < canvas.width * xCutoffPercentage) {
        takeDamage();
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
  const lineX = canvas.width * xCutoffPercentage;
  ctx.moveTo(lineX, 0);
  ctx.lineTo(lineX, canvas.height);
  ctx.lineWidth = 10;
  ctx.stroke();

  renderWords(ctx);
  renderStats(ctx);
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

startTimer();
main();
