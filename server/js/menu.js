import { canvW, canvH } from "./gvars.js";
// import { Socket } from "socket.io";
import { socket } from "./socket.js";

const button = {
  x: 500,
  y: 200,
  w: 100,
  h: 50,
};

export function renderMatchingScreen(ctx) {
  ctx.fillStyle = "rgba(0, 255, 0, 1)";
  ctx.fillRect(0, 0, canvW, canvH);

  ctx.fillStyle = "rgba(255, 0, 0, 1)";
  ctx.fillRect(button.x, button.y, button.w, button.h);
}

export function onClickCanvas(x, y) {
  if (
    x < button.x &&
    x > button.x - button.w &&
    y > button.y &&
    y < button.y + button.h
  ) {
    // button is clicked
    socket.emit("find_match");
    console.log("button clicked");
  }
}
