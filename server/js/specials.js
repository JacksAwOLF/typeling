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

export function sendSpecial(specialActive) {
  socket.emit("special", { specialActive });
}
