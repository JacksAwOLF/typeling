import {
  lanes,
  removeWord,
  addWordToLane,
  renderWords,
  incPPS,
} from "./lane.js";
import { incWordsTyped, renderStats, startTimer, takeDamage } from "./stats.js";
import { canvW, canvH, xCutoffPercentage } from "./gvars.js";
import { specialHighlightedSpan, sendSpecial } from "./specials.js";

let specialText = [];
let specialPos = 0;
let specialType = 0;
import { renderMatchingScreen, onClickCanvas } from "./menu.js";

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvW;
canvas.height = canvH;

// create the word input box
// or should we just draw this in the canvas?
const wordInput = document.createElement("input");
wordInput.style =
  "width: 1024px; height: 40px; font-size: 30px; text-align: center; border: None; outline: none;";
wordInput.onkeydown = (e) => {
  if (e.key === " " || e.key === "Enter") {
    const val = e.target.value.trim();

    // check special text
    if (val === specialText[specialPos]) {
      specialPos++;
      e.target.value = "";

      if (specialPos === specialText.length) {
        specialPos = 0;
        specialText = []; // TODO: update Special Text
        sendSpecial(id, specialType);
      }
    }

    // check lanes
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
const button1 = document.createElement("button");
const button2 = document.createElement("button");
const button3 = document.createElement("button");

button1.innerHTML = "1: Scientific Names";
button2.innerHTML = "2: Spanish";
button3.innerHTML = "3: Gibberish";
button1.onclick = () => {
  specialText = ["button1"];
  specialPos = 0;
  specialType = "scientific";
};
button2.onclick = () => {
  specialText = ["button2"];
  specialPos = 0;
  specialType = "spanish";
};
button3.onclick = () => {
  specialText = ["button3"];
  specialPos = 0;
  specialType = "gibberish";
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

const start = Date.now();
// update variables
const update = function (delta) {
  // if (txtReady) {
  // add words if necessary
  incPPS((Date.now() - start) / 1000);

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

let menu = true;

canvas.addEventListener(
  "click",
  (e) => {
    let x = e.pageX - 0,
      y = e.pageY - 0;
    onClickCanvas(x, y);
  },
  false
);

// render game
const render = function () {
  if (menu) {
    renderMatchingScreen(ctx);
    return;
  }

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

import { socket } from "./socket.js";

let myId = "";
let otherId = ""; // assume 2 player

socket.on("connection_confirmed", (data) => {
  myId = data.id;
});

socket.on("room_created", (data) => {
  if (data.players[0] === myId) otherId = data.players[1];
  else otherId = data.players[0];

  menu = false;
});

// Cross-browser support for requestAnimationFrame
const w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

startTimer();
main();
