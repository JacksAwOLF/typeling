import { lanes, removeWord, addWordToLane, renderWords } from "./lane.js";
import { incWordsTyped, renderStats, startTimer, takeDamage } from "./stats.js";
import { canvW, canvH, xCutoffPercentage } from "./gvars.js";
import { specialHighlightedSpan } from "./specials.js";

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvW;
canvas.height = canvH;
// canvas.style =
//   "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
document.body.appendChild(canvas);

// create the word input box
// or should we just draw this in the canvas?
const wordInput = document.createElement("input");
wordInput.style =
  "width: 1024px; height: 40px; font-size: 30px; text-align: center; border: None; outline: none;";
wordInput.onkeydown = (e) => {
  if (e.key === " " || e.key === "Enter") {
    // check special text
    if (val === specialText[specialPos]) {
      specialPos++;
      e.target.value = "";
    }

    // check lanes
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

// special abilities paragraph and number activated buttons
// create a div for the paragraph and buttons
let specialText = [];
let specialPos = 0;
const button1 = document.createElement("button");
const button2 = document.createElement("button");
const button3 = document.createElement("button");

button1.innerHTML = "1: Scientific Names";
button2.innerHTML = "2: Spanish";
button3.innerHTML = "3: Programming";
button1.onclick = () => {
  specialText = ["button1"];
  specialPos = 0;
};
button2.onclick = () => {
  specialText = ["button2"];
  specialPos = 0;
};
button3.onclick = () => {
  specialText = ["button3"];
  specialPos = 0;
};

const buttonDiv = document.createElement("div");
buttonDiv.style = "display: flex; flex-direction: column;";
buttonDiv.appendChild(button1);
buttonDiv.appendChild(button2);
buttonDiv.appendChild(button3);

const specialDiv = document.createElement("div");
specialDiv.style =
  "display: flex; flex-direction: row; width: 1024px; justify-content: center;";
specialDiv.appendChild(document.createElement("p"));
specialDiv.appendChild(buttonDiv);

// parent div
const windowDiv = document.createElement("div");
windowDiv.style =
  "display: flex; flex-direction: column; justify-content: center; align-items: center;";
windowDiv.appendChild(canvas);
windowDiv.appendChild(wordInput);
windowDiv.appendChild(specialDiv);

document.body.appendChild(windowDiv);

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

  // draw the special text
  specialDiv.children[0].innerHTML = specialHighlightedSpan(
    specialText,
    specialPos
  );
};

let then = Date.now();
const main = function () {
  let now = Date.now();
  let delta = now - then;
  then = now;
  update(delta / 1000);
  render();
  wordInput.focus();

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
