import { canvW, canvH, xCutoffPercentage } from "./gvars.js";
import { socket } from "./socket.js";

// global variables
let txtReady = false;
let wordBank = [];
const wordHeight = 15;
const mainLaneY = (canvH + wordHeight) / 2;
const mainTextFont = wordHeight + "px Comic Sans Ms";
const mainTextColor = "black";
export let lanes = [
  {
    y: mainLaneY,
    getNewInd: true,
    lineInd: -1,
    wordInd: -1,
    words: [],
    pps: 20, // pixels per second
  },
];
// y=\left(\frac{1}{4}x^{1.5}+20\right)
let lastModVal = -1;
export function incPPS(sinceStart) {
  // const secs = 5;
  // const inc = 5;

  // const thisModVal = Math.floor(sinceStart) % secs;
  // console.log(lastModVal, thisModVal);
  // if (lastModVal === inc - 1 && thisModVal === 0) {
  //   lanes[0].pps += inc;
  // }
  // lastModVal = thisModVal;
  const xx = Math.floor(sinceStart);
  lanes[0].pps = Math.min(80, 20 + xx ** 1.5 / 16);
}

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
export function removeWord(i, j) {
  lanes[i].words.splice(j, 1); // remove word
  if (lanes[i].lastWordInd > j) lanes[i].lastWordInd -= 1; // update previous word
}

// add new word to lane i
export function addWordToLane(i, ctx) {
  socket.on("add_words", (data) => {
    console.log("receive words", data.words);
    ctx.font = mainTextFont;
    ctx.fillStyle = mainTextColor;

    // get furthest word to the right
    let lastWord = undefined;
    for (let j = 0; j < lanes[i].words.length; j++)
      if (lastWord === undefined || lastWord.x < lanes[i].words[j].x)
        lastWord = lanes[i].words[j];
    let x =
      lastWord === undefined
        ? canvW
        : lastWord.x + ctx.measureText(lastWord.text + "  ").width;

    // add the words in data.words
    for (let i = 0; i < data.words.length; i++) {
      const word = data.words[i];

      lanes[0].words.push({
        x: x,
        y: lanes[0].y,
        // text: wordBank[lanes[0].lineInd][lanes[i].wordInd],
        text: word,
      });

      x += ctx.measureText(word + "  ").width;
    }
  });
}

export function renderWords(ctx) {
  for (let i = 0; i < lanes.length; i++) {
    ctx.fillStyle = "white";
    ctx.fillRect(
      canvW * xCutoffPercentage,
      lanes[i].y - wordHeight,
      canvW,
      wordHeight + 5
    );

    for (let j = 0; j < lanes[i].words.length; j++) {
      const word = lanes[i].words[j];
      ctx.font = mainTextFont;
      ctx.fillStyle = mainTextColor;
      ctx.fillText(word.text, word.x, word.y);
    }

    ctx.fillText("PPS: " + lanes[i].pps, 0, 500);
  }
}
