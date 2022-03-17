export default function renderGame({ state }, playerId) {
  const screen = document.getElementById("screen");
  const context = screen.getContext("2d");
  context.fillStyle = "white";
  context.clearRect(0, 0, 10, 10);

  function paintPixel({ x, y }, color) {
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }

  for (const playerId in state.players) {
    const player = state.players[playerId];
    paintPixel(player, "black");
  }

  for (const fruitId in state.fruits) {
    const fruit = state.fruits[fruitId];
    paintPixel(fruit, "green");
  }

  const player = state.players[playerId];
  if (player) {
    paintPixel(player, "#F0DB4F");
  }
  requestAnimationFrame(() => renderGame({ state }, playerId));
}
