export default function createGame() {
  const observers = [];
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 20,
      height: 20,
    },
  };
  function start() {
    const frequency = 2000;
    setInterval(addFruit, frequency);
  }
  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }
  function notifyAll(command) {
    for (const observer of observers) {
      observer(command);
    }
  }
  function setState(newState) {
    Object.assign(state, newState);
  }
  function addPlayer({ playerId, playerX, playerY }) {
    state.players[playerId] = {
      x: playerX ? playerX : Math.floor(Math.random() * state.screen.width),
      y: playerY ? playerY : Math.floor(Math.random() * state.screen.height),
    };
    const player = state.players[playerId];
    notifyAll({
      type: "add-player",
      player: {
        playerId,
        playerX: player.x,
        playerY: player.y,
      },
    });
  }
  function removePlayer({ playerId }) {
    delete state.players[playerId];
    notifyAll({
      type: "remove-player",
      playerId,
    });
  }
  function addFruit(fruit) {
    const fruitId = fruit?.fruitId
      ? fruit.fruitId
      : Math.floor(Math.random() * 1000000);
    const fruitX = fruit?.fruitX
      ? fruit.fruitX
      : Math.floor(Math.random() * state.screen.width);
    const fruitY = fruit?.fruitY
      ? fruit.fruitY
      : Math.floor(Math.random() * state.screen.height);
    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
    notifyAll({
      type: "add-fruit",
      fruit: {
        fruitId,
        fruitX,
        fruitY,
      },
    });
  }
  function removeFruit({ fruitId }) {
    delete state.fruits[fruitId];
  }
  function movePlayer(command) {
    const player = state.players[command.playerId];
    notifyAll(command);
    const acceptedMoves = {
      ArrowUp(player) {
        player.y = Math.max(player.y - 1, 0);
      },
      ArrowDown(player) {
        player.y = Math.min(player.y + 1, state.screen.width - 1);
      },
      ArrowLeft(player) {
        player.x = Math.max(player.x - 1, 0);
      },
      ArrowRight(player) {
        player.x = Math.min(player.x + 1, state.screen.height - 1);
      },
    };

    const moveAction = acceptedMoves[command.keyPressed];
    if (moveAction && player) {
      console.log(`> Moving ${command.playerId} with ${command.keyPressed}`);
      moveAction(player);
      checkCollision(player);
    }
  }
  function checkCollision(player) {
    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      if (fruit.x === player.x && fruit.y === player.y) {
        removeFruit({ fruitId });
      }
    }
  }

  return {
    movePlayer,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    state,
    setState,
    subscribe,
    start,
  };
}
