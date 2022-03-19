export default function createKeyboardListener(document) {
  const state = {
    observers: [],
    playerId: null,
  };

  function registerPlayerId(playerId) {
    state.playerId = playerId;
  }

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  document.addEventListener("keydown", handleKeydown);

  function handleKeydown(e) {
    const command = {
      type: "move-player",
      keyPressed: e.key,
      playerId: state.playerId,
    };
    notifyAll(command);
  }
  return {
    subscribe,
    registerPlayerId,
  };
}
