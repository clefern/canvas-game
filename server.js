import express from "express";
import http from "http";
import { Server } from "socket.io";

// GAME
import createGame from "./public/game.js";
const game = createGame();
// game.start();

// SERVER
const app = express();
const server = http.createServer(app);
const sockets = new Server(server);
app.use(express.static("public"));

game.subscribe((command) => {
  console.log("server subscribe", command);
  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`> Player connected on Server with id: ${playerId}`);
  game.addPlayer({ playerId });
  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    game.removePlayer({ playerId });
    console.log("player disconnected");
    socket.emit("setup", game.state);
  });
  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";
    game.movePlayer(command);
  });
});

server.listen(3000, () => {
  console.log("> server listening on port 3000");
});
