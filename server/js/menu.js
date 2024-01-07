import { canvW, canvH } from "./gvars.js";

export function renderMatchingScreen(ctx) {
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(0, 0, canvW, canvH);
}
