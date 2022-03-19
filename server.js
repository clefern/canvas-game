import express from "express";
import http from "http";
import socketio from "socket.io";

// GAME
import createGame from "./public/game.js";

// SERVER
const app = express();
const server = http.createServer(app);
const sockets = socketio(server);
app.use(express.static("public"));

const game = createGame();
game.start();

game.subscribe((command) => {
  console.log(`server ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`> Player connected on Server with id: ${playerId}`);
  game.addPlayer({ playerId });
  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    game.removePlayer({ playerId });
    console.log("> player disconnected");
  });
  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";
    console.log("> move player on server");
    game.movePlayer(command);
  });
});

server.listen(3000, () => {
  console.log("> server listening on port 3000");
});
