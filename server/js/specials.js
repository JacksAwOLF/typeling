import { socket } from "./socket.js";

let specialParagrahs = [];
let last_requested_paragraph = Date.now();

socket.on("send_paragraph", (data) => {
  console.log(data);
  specialParagrahs.push(data.paragraph);
});

// highlight text until i with the color light green
export function specialHighlightedSpan(words, specialPos) {
  let h = "<span style='background-color: lightgreen;'>";
  for (let i = 0; i < specialPos; i++) {
    h += words[i] + " ";
  }
  h += "</span>";
  for (let i = specialPos; i < words.length; i++) {
    h += words[i] + " ";
  }
  return h;
}

export function sendSpecial(player_ids, type) {
  const player_id = player_ids[Math.floor(Math.random() * player_ids.length)];
  socket.emit("attack_player", { player_id, type });
}

export function requestSpecialText() {
  if (specialParagrahs.length === 0) {
    if (last_requested_paragraph + 1000 < Date.now()) {
      last_requested_paragraph = Date.now();
      socket.emit("request_paragraph", {});
      console.log("requesting paragraph");
    }
    return [];
  }
  return specialParagrahs.pop().split(" ");
}
