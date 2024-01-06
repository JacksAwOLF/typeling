// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 720;
canvas.id = "canvas";
// canvas.onwheel = (e) => {
//   e.preventDefault();
// };
// canvas.onmousewheel = (e) => {
//   e.preventDefault();
// };
canvas.style =
  "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
document.body.appendChild(canvas);

// global variables
let txtReady = false;
let wordBank = [];
let lanes = [];

const removeWord = function (i, j) {
  lanes[i].words.splice(j, 1); // remove word
  if (lanes[i].lastWordInd > j) lanes[i].lastWordInd -= 1; // update previous word
};

// create the word input box
// or should we just draw this in the canvas?
const wordInput = document.createElement("input");
wordInput.style = "position: absolute; top: 80%; left: 40%;";
wordInput.onkeydown = (e) => {
  if (e.key === " " || e.key === "Enter") {
    const val = e.target.value.trim();
    for (let i = 0; i < lanes.length; i++) {
      for (let j = 0; j < lanes[i].words.length; j++) {
        if (val === lanes[i].words[j].text) {
          removeWord(i, j);
          e.target.value = "";
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

// fetch text

// const fs = require("fs");
// fs.readFile("wordbank/test.txt", (err, data) => {
//   if (err) throw err;
//   const text = data.toString();
//   wordBank = text.split("\n");
//   wordBank = wordBank.map((line) => line.split(" "));
//   console.log(wordBank);
//   txtReady = true;
// });

const str = `# rm all files
git rm -r --cached .
# add all files as per new .gitignore
git add .
# now, commit for new .gitignore to apply
git commit -m ".gitignore is now working"`;
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

// set up game
const init = function () {
  // tower
  tower.xCutoffPercentage = 0.25;
  tower.health = 10;

  // main lane
  lanes.push({
    y: 300,
    getNewInd: true,
    lineInd: -1,
    wordInd: -1,
    words: [],
    spd: 1,
  });
};

const mainLaneInd = 0;

const addWordToLane = function (i) {
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
    text: wordBank[lanes[i].lineInd][lanes[i].wordInd],
  });

  // update previous word so we can keep track when to add new word
  lanes[i].lastWordInd = lanes[i].words.length - 1;
};

// update variables
const update = function (delta) {
  if (txtReady) {
    ctx.font = mainTextFont;
    ctx.fillStyle = mainTextColor;
    for (let i = 0; i < lanes.length; i++) {
      if (lanes[i].wordInd === -1) {
        addWordToLane(i);
        continue;
      }

      const prevText = wordBank[lanes[i].lineInd][lanes[i].wordInd];
      const wordLen = ctx.measureText(prevText + "  ").width;
      const prevWord = lanes[i].words[lanes[i].lastWordInd];

      // draw a new word if previous word scrolled past the screen
      if (prevWord !== undefined && prevWord.x + wordLen < canvas.width) {
        addWordToLane(i);
      }
    }

    // update each word x position in each lane
    for (let i = 0; i < lanes.length; i++) {
      for (let j = 0; j < lanes[i].words.length; j++) {
        lanes[i].words[j].x -= lanes[i].spd;

        // check if hit the tower
        if (lanes[i].words[j].x < canvas.width * tower.xCutoffPercentage) {
          tower.health -= 1;
          removeWord(i, j);
        }
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
