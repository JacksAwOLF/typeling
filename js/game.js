// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 720;
canvas.height = 405;
canvas.onwheel = (e) => {
  e.preventDefault();
};
canvas.onmousewheel = (e) => {
  e.preventDefault();
};
canvas.style =
  "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
document.body.appendChild(canvas);

// create the word input box
// or should we just draw this in the canvas?
// const wordInput = document.createElement("input");
// word
// document.body.appendChild(wordInput);

// background image
let bgReady = false;
const bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/plantsVzombies.jpeg";

// fetch text
let txtReady = false;
let wordBank = [];

// const fs = require("fs");
// fs.readFile("wordbank/test.txt", (err, data) => {
//   if (err) throw err;
//   const text = data.toString();
//   wordBank = text.split("\n");
//   wordBank = wordBank.map((line) => line.split(" "));
//   console.log(wordBank);
//   txtReady = true;
// });

const str = `Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 10 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 334 bytes | 334.00 KiB/s, done.
Total 4 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/JacksAwOLF/typeling.git
   808c013..206f6fd  main -> main
victorchen@Victors-MacBook-Pro typeling %`;
const text = str.toString();
wordBank = text.split("\n");
wordBank = wordBank.map((line) => line.split(" "));
console.log(wordBank);
txtReady = true;

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

// const createNewWord = function (text) {
//   words.push({
//     x: window.innerWidth,
//     speed: 1,
//     text: text,
//   });
//   return words.length - 1;
// };

const lanes = [];

// set up game
const init = function () {
  // tower
  tower.xCutoffPercentage = 0.3;
  tower.health = 10;

  // main lane
  lanes.push({
    y: 300,
    getNewInd: true,
    lineInd: -1,
    wordInd: -1,
    words: [],
  });
};

const mainLaneInd = 0;

const addNewWord = function (i) {
  lanes[i].wordInd += 1;

  // pick a new line if no line picked or all words are draw on the current line
  if (
    lanes[i].lineInd === -1 ||
    lanes[i].wordInd === wordBank[lanes[i].lineInd].length
  ) {
    lanes[i].wordInd = 0;
    lanes[i].lineInd = Math.floor(Math.random() * wordBank.length);
  }

  // push new word into array
  lanes[i].words.push({
    x: canvas.width,
    y: lanes[i].y,
    spd: 5,
    text: wordBank[lanes[i].lineInd][lanes[i].wordInd],
  });

  // update previous word so we can keep track when to add new word
  lanes[i].lastWordInd = lanes[i].words.length - 1;
};

// update variables
const update = function (delta) {
  if (txtReady) {
    for (let i = 0; i < lanes.length; i++) {
      if (lanes[i].wordInd === -1) {
        addNewWord(i);
        continue;
      }

      const prevText = wordBank[lanes[i].lineInd][lanes[i].wordInd];
      const wordLen = ctx.measureText(prevText + " ").width;
      const prevWord = lanes[i].words[lanes[i].lastWordInd];

      // draw a new word if previous word scrolled past the screen
      if (prevWord.x + wordLen < canvas.width) {
        addNewWord(i);
      }
    }

    // update each word x position in each lane
    for (let i = 0; i < lanes.length; i++) {
      for (let j = 0; j < lanes[i].words.length; j++) {
        lanes[i].words[j].x -= lanes[i].words[j].spd;

        // check if hit the tower, if hit

        // update previous word
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
  const lineX = canvas.width * tower.xCutoffPercentage;
  ctx.moveTo(lineX, 0);
  ctx.lineTo(lineX, window.innerHeight);
  ctx.lineWidth = 10;
  ctx.stroke();

  // draw the lanes

  // draw the words
  ctx.font = "100px Comic Sans Ms";
  ctx.fillStyle = "black";
  for (let i = 0; i < lanes.length; i++) {
    for (let j = 0; j < lanes[i].words.length; j++) {
      const word = lanes[i].words[j];
      ctx.fillText(word.text, word.x, word.y);
    }
  }

  // ctx.fillText("Hello", 10, 50);
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
const w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

let then = Date.now();

init();
main();
