// keeps track so statistics such as WPM, health, and seconds
// also renders game over screen (health == 0)

import { canvW, canvH } from "./gvars.js";

let wordTimes = [];
export function incWordsTyped() {
  wordTimes.push(Date.now());
}

let health = 1000;
let gameEnd = false;
export function takeDamage() {
  health -= 1;
  if (health === 0) {
    gameEnd = true;
  }
}

export function getHealth() {
  return health;
}

export function getWPM() {
  const newList = wordTimes.filter((x) => Date.now() - x < 1000 * 60);
  wordTimes = newList;
  return newList.length;
}

let start = Date.now();
export function startTimer() {
  start = Date.now();
}

export function renderStats(ctx) {
  if (gameEnd) {
    ctx.fillStyle = "rgba(50, 50, 50, 0.7)";
    ctx.fillRect(0, 0, canvW, canvH);

    ctx.font = "100px Times New Roman";
    ctx.fillStyle = "white";
    const dim = ctx.measureText("Game Over");
    const hh = dim.actualBoundingBoxAscent - dim.actualBoundingBoxDescent;
    ctx.fillText("Game Over", (canvW - dim.width) / 2, (canvH - hh) / 2);
    return;
  }

  ctx.fillStyle = "white";
  ctx.fillRect(30, 100, 200, 250);

  ctx.font = "20px Times New Roman";
  ctx.fillStyle = "black";

  ctx.fillText(getWPM() + " WPM", 50, 150);

  ctx.fillText("Health: " + health, 50, 180);

  const secs = Math.floor((Date.now() - start) / 1000);
  ctx.fillText("Seconds Elapsed: " + secs, 50, 210);
}
