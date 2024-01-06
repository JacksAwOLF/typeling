// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 720;
canvas.id = "canvas";

canvas.style =
  "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
document.body.appendChild(canvas);

// global variables
let txtReady = false;
let wordBank = [];
let lanes = [
  {
    y: 300,
    getNewInd: true,
    lineInd: -1,
    wordInd: -1,
    words: [],
    pps: 100, // pixels per second
  },
];

const str = `# rm all files
git rm -r --cached .
# add all files as per new .gitignore
git add .
# now, commit for new .gitignore to apply
git commit -m ".gitignore is now working"`;
const text = str.toString();
wordBank = text.split("\n");
wordBank = wordBank.map((line) => line.split(" "));
console.log("wordbank:", wordBank);
txtReady = true;

// remove the jth word from the ith lane
const removeWord = function (i, j) {
  lanes[i].words.splice(j, 1); // remove word
  if (lanes[i].lastWordInd > j) lanes[i].lastWordInd -= 1; // update previous word
};

// remove the first matching word from lanes
// word should also be on screen
const inputOnKeyDown = (e) => {
  if (e.key === " " || e.key === "Enter") {
    const val = e.target.value.trim();
    for (let i = 0; i < lanes.length; i++) {
      for (let j = 0; j < lanes[i].words.length; j++) {
        const word = lanes[i].words[j];
        if (val === word.text && word.x < canvas.width) {
          removeWord(i, j);
          e.target.value = "";
          break;
        }
      }
    }
  }

  if (e.key === " ") e.preventDefault();
};

// add new word to lane i
const addWordToLane = function (i, ctx) {
  lanes[i].wordInd += 1;

  // pick a new line
  if (
    lanes[i].lineInd === -1 ||
    lanes[i].wordInd === wordBank[lanes[i].lineInd].length
  ) {
    lanes[i].wordInd = 0;
    lanes[i].lineInd = Math.floor(Math.random() * wordBank.length);
  }

  // pick next word on the line
  const lastWord = lanes[i].words[lanes[i].lastWordInd];
  let x = canvas.width;

  if (lastWord !== undefined) {
    x = lastWord.x + ctx.measureText(lastWord.text + "  ").width;
  }

  lanes[i].words.push({
    x: x,
    y: lanes[i].y,
    text: wordBank[lanes[i].lineInd][lanes[i].wordInd],
  });

  // update last word added
  lanes[i].lastWordInd = lanes[i].words.length - 1;
};

// create the word input box
// or should we just draw this in the canvas?
const wordInput = document.createElement("input");
wordInput.style = "position: absolute; top: 80%; left: 40%;";
wordInput.onkeydown = inputOnKeyDown;
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
  if (txtReady) {
    // add words if necessary
    ctx.font = mainTextFont;
    ctx.fillStyle = mainTextColor;
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
