import {
  lanes,
  removeWord,
  addWordToLane,
  renderWords,
  incPPS,
  addSpecials,
} from "./lane.js";
import {
  incWordsTyped,
  renderStats,
  startTimer,
  takeDamage,
  getHealth,
  getWPM,
} from "./stats.js";
import { canvW, canvH, xCutoffPercentage } from "./gvars.js";
import {
  specialHighlightedSpan,
  sendSpecial,
  requestSpecialText,
} from "./specials.js";

let specialText = [];
let specialPos = 0;
let specialType = 0;
import { renderMatchingScreen, onClickCanvas } from "./menu.js";

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvW;
canvas.height = canvH;

let myId = "";
let otherId = ""; // assume 2 player

// create the word input box
// or should we just draw this in the canvas?
const wordInput = document.createElement("input");
wordInput.style =
  "width: 1024px; height: 40px; font-size: 30px; text-align: center; border: None; outline: none;";
wordInput.onkeydown = (e) => {
  if (e.key === " " || e.key === "Enter") {
    const val = e.target.value.trim();

    // check special text
    if (specialText.length > specialPos && val === specialText[specialPos]) {
      specialPos++;
      e.target.value = "";

      if (specialPos === soecialText.length) {
        specialPos = 0;
        specialText = []; // TODO: update Special Text
        console.log("sending special", otherId, specialType);
        sendSpecial(otherId, specialType);
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
  specialType = "scientific";
};
button2.onclick = () => {
  specialType = "spanish";
};
button3.onclick = () => {
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

const button = document.createElement("button");
button.onclick = onClickCanvas;
button.style =
  "position: absolute; top: 45%; left: 45%; width: 10%; height: 10%;";
windowDiv.appendChild(button);

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

addWordToLane(0, ctx);

let start = Date.now();
let lastRequested = Date.now();
let lastSent = Date.now();

let gameWon = false;
// update variables
const update = function (delta) {
  if (menu) return;

  if (getHealth() === 0 || gameWon) {
    return;
  }
  // if (txtReady) {
  // add words if necessary
  incPPS((Date.now() - start) / 1000);

  for (let i = 0; i < lanes.length; i++) {
    if (lanes[i].words.length < 50 && Date.now() - lastRequested > 5000) {
      // addWordToLane(i, ctx);
      socket.emit("request_words");

      console.log("requesting words");
      lastRequested = Date.now();
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

        if (getHealth() === 0) {
          socket.emit("transmit_info_to_room", {
            player_id: myId,
            health: getHealth(),
            wpm: getWPM(),
          });
        }
      }
    }
  }

  if (Date.now() - lastSent > 500) {
    lastSent = Date.now();
    socket.emit("transmit_info_to_room", {
      player_id: myId,
      health: getHealth(),
      wpm: getWPM(),
    });
  }

  // console.log("special text", specialText, specialPos);
  // update special text
  if (specialText.length == 0) {
    specialText = requestSpecialText();
  }
};

// setInterval();

let menu = true;

// canvas.addEventListener(
//   "click",
//   (e) => {
//     // console.log(e);
//     // let x = e.pageX - ,
//     //   y = e.pageY - 0;
//     onClickCanvas(x, y);
//   },
//   false
// );

let otherHealth = 0;
let otherWPM = 0;

socket.on("transmit_info_to_room", (data) => {
  if (data.player_id === myId) return;
  otherHealth = data.health;
  otherWPM = data.wpm;

  if (otherHealth === 0) {
    gameWon = true;
  }
  console.log(data);
});

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
  // let otherHealth = 0;
  // let otherWPM = 0;

  ctx.font = "20px Times New Roman";
  ctx.fillStyle = "black";
  ctx.fillText("Other Player Health " + otherHealth, 50, 250);
  ctx.fillText("Other Player WPM " + otherWPM, 50, 280);

  // draw the special text
  specialDiv.children[0].innerHTML = specialHighlightedSpan(
    specialText,
    specialPos
  );

  if (gameWon) {
    ctx.fillStyle = "rgba(50, 50, 50, 0.7)";
    ctx.fillRect(0, 0, canvW, canvH);

    ctx.font = "100px Times New Roman";
    ctx.fillStyle = "white";
    const dim = ctx.measureText("Game Won!");
    const hh = dim.actualBoundingBoxAscent - dim.actualBoundingBoxDescent;
    ctx.fillText("Game Won!", (canvW - dim.width) / 2, (canvH - hh) / 2);
    return;
  }
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

socket.on("connection_confirmed", (data) => {
  myId = data.id;
  console.log("connected", data);
});

socket.on("room_created", (data) => {
  if (data.players[0] === myId) otherId = data.players[1];
  else otherId = data.players[0];
  menu = false;
  console.log("room created", data);

  start = Date.now();
  button.remove();
  // let lastRequested = Date.now();
  // let lastSent = Date.now();
});

socket.on("player_attacked", (data) => {
  console.log("recei", data);
  if (data.player_id !== myId) return;
  addSpecials(data.words, ctx);
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
