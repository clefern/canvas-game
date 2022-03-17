export default function createKeyboardListener() {
  const state = {
    observers: [],
    playerId: null,
  };
  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }
  function notifyAll(command) {
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }
  function registerPlayerId(playerId) {
    state.playerId = playerId;
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
