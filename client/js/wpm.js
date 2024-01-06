const start = Date.now();
let wordsTyped = 0;

export function incWordsTpyed() {
  wordsTyped++;
}

export function WPM() {
  let timeElapsed = (Date.now() - start) / 60000;
  return Math.round(wordsTyped / timeElapsed);
}

export function displayWPM(ctx) {
  let wpm = wordsTyped === 0 ? 0 : WPM();

  // ctx.font = mainTextFont;
  // ctx.fillStyle = mainTextColor;

  ctx.fillText(wpm + " WPM", 150, 150);
}
