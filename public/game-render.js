export default function renderGame(
  screen,
  context,
  game,
  requestAnimationFrame,
  currentPlayerId
) {
  context.fillStyle = "white";
  context.globalAlpha = 1;
  context.clearRect(0, 0, game.state.screen.width, game.state.screen.height);

  function paintPixel({ x, y }, color) {
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];
    context.globalAlpha = 0.1;
    paintPixel(player, "black");
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    context.globalAlpha = 1;
    paintPixel(fruit, "green");
  }

  const currentPlayer = game.state.players[currentPlayerId];
  if (currentPlayer) {
    paintPixel(currentPlayer, "#F0DB4F");
  }
  requestAnimationFrame(() =>
    renderGame(screen, context, game, requestAnimationFrame, currentPlayerId)
  );
}
