const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");
const fs = require("fs");
const readline = require("readline");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

const players = [],
  rooms = [];

async function processLineByLine(filename) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity,
  });

  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }

  return lines;
}

class WordBank {
  constructor(wordbank_file) {
    this.words = null;
    (async () => {
      this.words = await processLineByLine(wordbank_file);
    })();
  }

  getBatch = (num_words = 50) => {
    if (this.words === null) return null;

    let batch = [];
    for (let i = 0; i < num_words; i++) {
      const index = Math.floor(Math.random() * this.words.length);
      batch.push(this.words[index]);
    }

    return batch;
  };
}

const english = new WordBank("wordbank/english-words.txt");
const scientific = new WordBank("wordbank/scientific-names.txt");
const spanish = new WordBank("wordbank/spanish.txt");
const gibberish = new WordBank("wordbank/gibberish.txt");

class Room {
  constructor(players) {
    this.player_ids = [];
    this.room_id = "room_";
    for (let player of players) {
      this.room_id = "_" + player.id;
      this.player_ids.push(player.id);
    }
    this.room_id = this.room_id.slice(0, -1);

    for (let player of players) {
      player.join(this.room_id);
      player.on("transmit_info_to_room", (msg) => {
        io.to(this.room_id).emit("transmit_info_to_room", msg);
      });
      player.on("attack_player", (data) => {
        this.sendAttack(data.player_id, data.type);
      });

      player.on("request_words", () => this.queueWords());
      player.on("leave_room", () => this.leaveRoom(player));
      player.on("disconnect", (reason) => {
        if (reason === "transport close") this.leaveRoom(player);
      });
    }

    io.to(this.room_id).emit("room_created", {
      room_id: this.room_id,
      players: this.player_id,
    });

    this.last_queue_words = 0;
    this.queueWords();
  }

  leaveRoom = (player) => {
    player.leave(this.room_id);
    this.player_ids.splice(this.player_ids.indexOf(player.id), 1);
    io.to(this.room_id).emit("transmit_info_to_room", {
      player_id: player.id,
      health: 0,
      wpm: 0,
    });
  };
  sendAttack = (player_id, type) => {
    const wordbank =
      type === "scientific"
        ? scientific
        : type === "spanish"
        ? spanish
        : gibberish;
    assert(wordbank.words !== null);

    io.to(this.room_id).emit("player_attacked", {
      player_id: player_id,
      words: wordbank.getBatch(),
    });
  };

  queueWords = () => {
    if (Date.now() - this.last_queue_words < 5000) return;
    this.last_queue_words = Date.now();
    io.to(this.room_id).emit("add_words", { words: english.getBatch() });
  };
}

io.on("connection", (client) => {
  client.emit("connection_confirmed", { id: client.id });
  client.on("find_match", () => {
    for (let queued_player of players) {
        if (client.id === queued_player.id) {
            return;
        }
    }

    players.push(client);

    if (players.length >= 2) {
      const player1 = players[players.length - 1];
      const player2 = players[players.length - 2];

      players.pop();
      players.pop();

      const room = new Room([player1, player2]);
      rooms.push(room);
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "./index.html"));
});

app.use("/js", express.static(join(__dirname, "./js")));
app.use("/images", express.static("images"));

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
