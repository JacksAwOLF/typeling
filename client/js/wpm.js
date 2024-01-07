let wordTimes = [];

export function incWordsTyped() {
  wordTimes.push(Date.now());
}

export function renderWPM(ctx) {
  const newList = wordTimes.filter((x) => Date.now() - x < 1000 * 60);
  const wLastMin = newList.length;
  wordTimes = newList;
  // ctx.font = mainTextFont;
  // ctx.fillStyle = mainTextColor;
  ctx.fillText(newList.length + " WPM", 50, 150);
}

let health = 10;

export function takeDamage() {
  health -= 1;
}

export function renderHealth(ctx) {
  // ctx.font = mainTextFont;
  // ctx.fillStyle = mainTextColor;
  ctx.fillText("Health: " + health, 50, 200);
}

const start = Date.now();
// export function
