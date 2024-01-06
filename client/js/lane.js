// global variables
let txtReady = false;
let wordBank = [];
export let lanes = [
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
export function removeWord(i, j) {
  lanes[i].words.splice(j, 1); // remove word
  if (lanes[i].lastWordInd > j) lanes[i].lastWordInd -= 1; // update previous word
}

// add new word to lane i
export function addWordToLane(i, ctx, canvW) {
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
  let lastWord = undefined;
  for (let j = 0; j < lanes[i].words.length; j++)
    if (lastWord === undefined || lastWord.x < lanes[i].words[j].x)
      lastWord = lanes[i].words[j];

  lanes[i].words.push({
    x:
      lastWord === undefined
        ? canvW
        : lastWord.x + ctx.measureText(lastWord.text + " ").width,
    y: lanes[i].y,
    text: wordBank[lanes[i].lineInd][lanes[i].wordInd],
  });

  // update last word added
  lanes[i].lastWordInd = lanes[i].words.length - 1;
}
