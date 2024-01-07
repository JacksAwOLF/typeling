export const socket = io();

socket.on("connection_confirmed", (data) => {
  console.log("connection confirmed: " + data);
});
