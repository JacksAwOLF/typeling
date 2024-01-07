let wordTimes = [];

export function incWordsTyped() {
  wordTimes.push(Date.now());
}

export function displayWPM(ctx) {
  const newList = wordTimes.filter((x) => Date.now() - x < 1000 * 60);
  const wLastMin = newList.length;
  wordTimes = newList;
  ctx.fillText(newList.length + " WPM", 150, 150);
}
